'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getQRSubmission, decodeQRCode, generateQRImageUrl } from '@/lib/qr-utils';
import { GOVERNMENT_SERVICES } from '@/lib/government-services';
import type { SubmittedService } from '@/lib/government-services';
import { INDIAN_STATES } from '@/lib/indian-locations';

import jsQR from 'jsqr';
import { MessageSquare, Mail, Bell, ShieldAlert, ShieldCheck, MapPin } from 'lucide-react';
import { MessageCenter } from '@/components/message-center';
import { DocumentCard } from '@/components/document-card';

interface AdminDashboardProps {
  restrictedServiceId?: number;
  serviceName?: string;
  adminState?: string;
  adminDistrict?: string;
  onLogout?: () => void;
}

export const AdminDashboard = ({ restrictedServiceId, serviceName, adminState, adminDistrict, onLogout }: AdminDashboardProps) => {
  const [submissions, setSubmissions] = useState<SubmittedService[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedService | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [activeChat, setActiveChat] = useState<{ userEmail: string; serviceId: number; serviceName: string } | null>(null);
  const [inbox, setInbox] = useState<any[]>([]);
  const [lastMsgId, setLastMsgId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; msg: string; user: string } | null>(null);
  const [scanMode, setScanMode] = useState(false);
  const [manualQRInput, setManualQRInput] = useState('');
  const [filterService, setFilterService] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [editDetails, setEditDetails] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'submitted' | 'under_review' | 'processing' | 'completed' | 'ready_for_collection' | 'rejected'>('submitted');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Status labels and colors with icons - Modern clean design
  const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string; icon: string; statBg: string; statText: string }> = {
    submitted: { label: 'Submitted', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-500', icon: '📥', statBg: 'bg-blue-500', statText: 'text-white' },
    under_review: { label: 'Under Review', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-500', icon: '👁️', statBg: 'bg-amber-500', statText: 'text-white' },
    processing: { label: 'Processing', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-500', icon: '⚙️', statBg: 'bg-orange-500', statText: 'text-white' },
    completed: { label: 'Completed', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-500', icon: '✅', statBg: 'bg-emerald-500', statText: 'text-white' },
    ready_for_collection: { label: 'Ready', color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-500', icon: '📦', statBg: 'bg-teal-500', statText: 'text-white' },
    rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-500', icon: '❌', statBg: 'bg-red-500', statText: 'text-white' },
  };

  // Load submissions
  const loadSubmissions = async () => {
    try {
      const url = restrictedServiceId
        ? `/api/submissions/list?serviceId=${restrictedServiceId}`
        : '/api/submissions/list';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  useEffect(() => {
    loadSubmissions();
    const interval = setInterval(loadSubmissions, 5000);
    return () => clearInterval(interval);
  }, [restrictedServiceId]);



  // Load Inbox messages
  const loadInbox = async () => {
    try {
      const url = restrictedServiceId
        ? `/api/messages?serviceId=${restrictedServiceId}`
        : `/api/messages`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        const conversations: any[] = [];
        const seen = new Set();

        // Sort by timestamp desc
        const sortedMsgs = data.messages.sort((a: any, b: any) => b.timestamp - a.timestamp);

        sortedMsgs.forEach((m: any) => {
          const key = `${m.userEmail}-${m.serviceId}`;
          if (!seen.has(key)) {
            // Count unread from user for this specific conversation
            const convUnread = data.messages.filter((msg: any) =>
              msg.userEmail === m.userEmail &&
              msg.serviceId === m.serviceId &&
              !msg.read &&
              msg.sender === 'user'
            ).length;

            conversations.push({ ...m, unreadCount: convUnread });
            seen.add(key);
          }
        });

        setInbox(conversations);

        // Toast Notification Logic
        if (sortedMsgs.length > 0) {
          const newest = sortedMsgs[0];
          if (newest.id !== lastMsgId && newest.sender === 'user') {
            setLastMsgId(newest.id);
            setToast({ show: true, msg: newest.content, user: newest.userEmail });
            // Close toast after 5 seconds
            setTimeout(() => setToast(null), 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error loading inbox:', error);
    }
  };

  useEffect(() => {
    loadInbox();
    const interval = setInterval(loadInbox, 5000);
    return () => clearInterval(interval);
  }, [restrictedServiceId]);

  // Initialize editable details when an application is opened
  useEffect(() => {
    if (selectedSubmission) {
      setEditDetails(selectedSubmission.userDetails || {});
    } else {
      setEditDetails({});
    }
  }, [selectedSubmission]);

  // Camera logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const scanQRCode = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            setScanResult(code.data);
            handleScannedCode(code.data);
            return;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scanQRCode);
    };

    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
          requestAnimationFrame(scanQRCode);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            requestAnimationFrame(scanQRCode);
          }
        } catch (e) {
          console.error('Could not access any camera');
        }
      }
    };

    if (scanMode) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [scanMode]);

  const handleScannedCode = (data: string) => {
    const decoded = decodeQRCode(data);
    if (decoded) {
      const submission = submissions.find(s => s.id === decoded.submissionId);
      if (submission) {
        setSelectedSubmission(submission);
        setScanMode(false);
      }
    }
  };

  const handleManualQRScan = () => {
    if (manualQRInput.trim()) {
      handleScannedCode(manualQRInput.trim());
      setManualQRInput('');
    }
  };

  const handleExportData = () => {
    const data = submissions.map((sub) => ({
      id: sub.id,
      service: sub.serviceName,
      status: STATUS_CONFIG[sub.status || 'submitted']?.label || sub.status,
      state: sub.userDetails?._state || '',
      district: sub.userDetails?._district || '',
      ...Object.fromEntries(
        Object.entries(sub.userDetails || {}).filter(([k]) => !k.startsWith('_'))
      ),
      submittedAt: new Date(sub.submittedAt).toLocaleString(),
    }));

    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers,
      ...data.map((d: any) => headers.map(h => d[h] || '')),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaani-submissions-${Date.now()}.csv`;
    a.click();
  };

  const handleVerifySubmission = async (submission: SubmittedService) => {
    setVerifyingId(submission.id);
    setIsVerifying(true);

    try {
      // Notify backend that admin is viewing
      const response = await fetch(`/api/submissions/${submission.id}?role=admin&viewer=admin_panel`);
      const data = await response.json();

      if (data.success) {
        // Update the local submission data with the status from backend
        const updatedSubmission = {
          ...submission,
          status: data.submission.status,
          statusLabel: data.submission.statusLabel,
          statusHistory: data.submission.statusHistory,
          isExpired: data.submission.isExpired
        };

        setTimeout(() => {
          setSelectedSubmission(updatedSubmission);
          setIsVerifying(false);
          setVerifyingId(null);
        }, 500);
      }
    } catch (error) {
      console.error('Error verifying submission:', error);
      setSelectedSubmission(submission);
      setIsVerifying(false);
      setVerifyingId(null);
    }
  };

  // Update submission status
  const handleStatusUpdate = async (submissionId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'status',
          newStatus,
          notes,
          adminId: 'admin_panel'
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: newStatus as any, statusLabel: data.submission.statusLabel }
            : sub
        ));
        
        if (selectedSubmission?.id === submissionId) {
          setSelectedSubmission(prev => prev ? {
            ...prev,
            status: newStatus as any,
            statusLabel: data.submission.statusLabel,
            statusHistory: data.submission.statusHistory
          } : null);
        }
        
        alert(`Status updated to: ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Admin location filter - always apply if admin has state/district set
      if (adminState && sub.userDetails?._state !== adminState) {
        return false;
      }
      if (adminDistrict && sub.userDetails?._district !== adminDistrict) {
        return false;
      }
      // Service filter
      if (filterService && !sub.serviceName.toLowerCase().includes(filterService.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [submissions, filterService, adminState, adminDistrict]);

  if (selectedSubmission) {
    const qrImageUrl = generateQRImageUrl(selectedSubmission.id);
    const currentStatus = selectedSubmission.status || 'submitted';
    const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.submitted;
    const serviceDef = GOVERNMENT_SERVICES.find(s => s.id === selectedSubmission.serviceId);
    const serviceFields = serviceDef?.fields || [];
    const extraEntries = Object.entries(selectedSubmission.userDetails || {}).filter(
      ([key]) => !serviceFields.some(f => f.id === key)
    );

    return (
      <Card className="w-full max-w-4xl mx-auto p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-8 text-white flex justify-between items-center">
          <div>
            <Button onClick={() => setSelectedSubmission(null)} variant="ghost" className="mb-2 text-white/70 hover:text-white p-0">
              ← Back to List
            </Button>
            <h2 className="text-3xl font-black">{selectedSubmission.serviceName}</h2>
            <p className="text-white/70">Application Details</p>
            {/* Location Badge */}
            {selectedSubmission.userDetails._state && selectedSubmission.userDetails._district && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full">
                <MapPin className="w-4 h-4 text-white/70" />
                <span className="text-sm font-semibold text-white">
                  {selectedSubmission.userDetails._district}, {selectedSubmission.userDetails._state}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Status</p>
            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* Status Update Section - Workflow Based */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-bold text-gray-700">Actions:</span>
            
            {/* Workflow-based buttons - show only relevant next steps */}
            {currentStatus === 'submitted' && (
              <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'under_review')}
              >
                👁️ Start Review
              </Button>
            )}
            
            {currentStatus === 'under_review' && (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'processing')}
              >
                ⚙️ Start Processing
              </Button>
            )}
            
            {currentStatus === 'processing' && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'completed')}
              >
                ✅ Mark Complete
              </Button>
            )}
            
            {currentStatus === 'completed' && (
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'ready_for_collection')}
              >
                📦 Ready for Collection
              </Button>
            )}
            
            {/* Reject button - available except for final states */}
            {!['ready_for_collection', 'rejected'].includes(currentStatus) && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => {
                  const notes = prompt('Enter rejection reason:');
                  if (notes !== null) {
                    handleStatusUpdate(selectedSubmission.id, 'rejected', notes || 'Application rejected');
                  }
                }}
              >
                ❌ Reject
              </Button>
            )}
            
            {/* Final state indicators */}
            {currentStatus === 'ready_for_collection' && (
              <span className="px-3 py-1 bg-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                ✓ Ready for Collection - User Notified
              </span>
            )}
            {currentStatus === 'rejected' && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                ✗ Application Rejected
              </span>
            )}
          </div>
          
          {/* Current status indicator */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span>Current:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
            {currentStatus !== 'ready_for_collection' && currentStatus !== 'rejected' && (
              <>
                <span>→</span>
                <span className="text-gray-400">
                  {currentStatus === 'submitted' && 'Next: Under Review'}
                  {currentStatus === 'under_review' && 'Next: Processing'}
                  {currentStatus === 'processing' && 'Next: Completed'}
                  {currentStatus === 'completed' && 'Next: Ready for Collection'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">User Information</h3>
            <div className="grid grid-cols-1 gap-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {serviceFields.map((field) => {
                const value = editDetails[field.id] ?? '';
                const isFileField = field.type === 'file';
                const isLongText = field.type === 'textarea';

                return (
                  <div key={field.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:border-cyan-200 hover:bg-white">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {field.label}
                    </p>
                    {isFileField ? (
                      <p className="text-sm font-medium text-gray-700">
                        {value ? `File info: ${value}` : 'File uploaded by citizen (view original submission if needed).'}
                      </p>
                    ) : isLongText ? (
                      <Textarea
                        value={value}
                        onChange={(e) =>
                          setEditDetails((prev) => ({
                            ...prev,
                            [field.id]: e.target.value,
                          }))
                        }
                        className="mt-1 text-sm"
                      />
                    ) : (
                      <Input
                        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                        value={value}
                        onChange={(e) =>
                          setEditDetails((prev) => ({
                            ...prev,
                            [field.id]: e.target.value,
                          }))
                        }
                        className="mt-1 text-sm"
                      />
                    )}
                  </div>
                );
              })}

              {extraEntries.map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:border-cyan-200 hover:bg-white">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm font-medium text-gray-800">{value || 'N/A'}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-purple-50 p-6 rounded-xl border border-cyan-100 mt-8">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Submission Timeline</p>
              <div className="space-y-2 font-mono text-sm text-purple-900">
                <div className="flex justify-between">
                  <span>Submitted:</span>
                  <span>{new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Status:</span>
                  <span className={`font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
                </div>
              </div>
              {/* Status History */}
              {selectedSubmission.statusHistory && selectedSubmission.statusHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Status History</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedSubmission.statusHistory.slice().reverse().map((entry, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-purple-700">{STATUS_CONFIG[entry.status]?.label || entry.status}</span>
                        <span className="text-purple-500">{new Date(entry.changedAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Document Card Preview - Shows for Completed and Ready for Collection */}
            <DocumentCard
              serviceId={selectedSubmission.serviceId}
              serviceName={selectedSubmission.serviceName}
              userDetails={selectedSubmission.userDetails}
              submissionId={selectedSubmission.id}
              status={currentStatus}
            />
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300">
            <div className="mb-6 p-6 bg-white rounded-2xl shadow-xl ring-8 ring-purple-50 group hover:ring-purple-100 transition-all">
              {qrImageUrl && (
                <Image
                  src={qrImageUrl || "/placeholder.svg"}
                  alt="QR Code"
                  width={250}
                  height={250}
                  className="rounded-lg group-hover:scale-105 transition-transform"
                />
              )}
            </div>

            <div className="text-center mb-8">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Application Status</p>
              <div className={`text-2xl font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {currentStatus === 'ready_for_collection' || currentStatus === 'rejected' 
                  ? 'QR Code is no longer valid' 
                  : 'QR Code is active'}
              </p>
            </div>

            <Button
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrImageUrl;
                link.download = `submission-${selectedSubmission.id}.png`;
                link.click();
              }}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white rounded-xl shadow-lg font-bold mb-3"
            >
              Export QR Proof
            </Button>

            <div className="w-full flex flex-col gap-3 mb-2">
              <Button
                variant="outline"
                onClick={async () => {
                  if (!selectedSubmission) return;
                  setIsVerifying(true);
                  try {
                    const res = await fetch(`/api/submissions/${selectedSubmission.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        updates: editDetails,
                        adminId: 'official_admin',
                        adminKey: process.env.NEXT_PUBLIC_ADMIN_KEY || '',
                        mode: 'save',
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert('Changes saved. You can now apply and notify the citizen when ready.');
                    } else {
                      alert(data.error || 'Failed to save changes');
                    }
                  } catch (error) {
                    console.error('Error saving submission:', error);
                    alert('Request failed while saving');
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                className="w-full h-12 rounded-xl border-gray-200 font-bold"
              >
                Save Changes Only
              </Button>
            </div>

            {/* Dynamic workflow button based on current status */}
            {currentStatus !== 'ready_for_collection' && currentStatus !== 'rejected' && (
              <Button
                onClick={async () => {
                  setIsVerifying(true);
                  // Determine next status in workflow
                  const statusWorkflow: Record<string, string> = {
                    submitted: 'under_review',
                    under_review: 'processing',
                    processing: 'completed',
                    completed: 'ready_for_collection'
                  };
                  const nextStatus = statusWorkflow[currentStatus] || 'under_review';
                  const statusMessages: Record<string, string> = {
                    under_review: 'Application is now Under Review. User has been notified.',
                    processing: 'Application is now being Processed. User has been notified.',
                    completed: 'Application Completed! User has been notified.',
                    ready_for_collection: 'Application is Ready for Collection. User has been notified to collect.'
                  };
                  
                  try {
                    // First save any changes
                    if (Object.keys(editDetails).length > 0) {
                      await fetch(`/api/submissions/${selectedSubmission.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          updates: editDetails,
                          adminId: 'official_admin',
                          adminKey: process.env.NEXT_PUBLIC_ADMIN_KEY || '',
                          mode: 'save',
                        }),
                      });
                    }
                    
                    // Then update status
                    await handleStatusUpdate(selectedSubmission.id, nextStatus);
                    alert(statusMessages[nextStatus] || 'Status updated successfully!');
                    setSelectedSubmission(null);
                    loadSubmissions();
                  } catch (e) {
                    console.error(e);
                    alert('Request failed');
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                disabled={isVerifying}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isVerifying ? 'Processing...' : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    {currentStatus === 'submitted' && 'Start Review & Notify'}
                    {currentStatus === 'under_review' && 'Start Processing & Notify'}
                    {currentStatus === 'processing' && 'Mark Complete & Notify'}
                    {currentStatus === 'completed' && 'Ready for Collection & Notify'}
                  </>
                )}
              </Button>
            )}
            
            {/* Final state message */}
            {(currentStatus === 'ready_for_collection' || currentStatus === 'rejected') && (
              <div className={`w-full h-14 rounded-xl shadow-lg font-bold flex items-center justify-center gap-2 ${
                currentStatus === 'ready_for_collection' ? 'bg-emerald-200 text-emerald-700' : 'bg-red-100 text-red-600'
              }`}>
                {currentStatus === 'ready_for_collection' ? '✓ Ready for Collection - User Notified' : '✗ Application Rejected'}
              </div>
            )}
          </div>

        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar - Dark Theme */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo Section */}
        <div className={`p-5 border-b border-gray-800 ${sidebarCollapsed ? 'px-3' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">V</span>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-black text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Vaani</h1>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Admin Portal</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Location Info */}
        {adminState && adminDistrict && !sidebarCollapsed && (
          <div className="px-5 py-3 bg-gray-800/50 border-b border-gray-800">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
            <p className="font-bold text-white">{adminDistrict}</p>
            <p className="text-xs text-gray-400">{adminState}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Quick Stats */}
          {!sidebarCollapsed && (
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Quick Stats</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Applications</span>
                  <span className="text-lg font-bold text-white">{filteredSubmissions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Pending</span>
                  <span className="text-lg font-bold text-amber-400">
                    {filteredSubmissions.filter(s => ['submitted', 'under_review', 'processing'].includes(s.status || 'submitted')).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Completed</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {filteredSubmissions.filter(s => ['completed', 'ready_for_collection'].includes(s.status || '')).length}
                  </span>
                </div>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="text-center py-2 mb-2">
              <span className="text-2xl font-bold text-white">{filteredSubmissions.length}</span>
              <p className="text-[9px] text-gray-400">Total</p>
            </div>
          )}

          {/* Quick Actions */}
          <p className={`text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 ${sidebarCollapsed ? 'text-center' : 'px-3'}`}>
            {sidebarCollapsed ? '•••' : 'Quick Actions'}
          </p>
          <button
            onClick={() => setScanMode(!scanMode)}
            className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl transition-all ${
              scanMode ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{scanMode ? '✕' : '📷'}</span>
            {!sidebarCollapsed && <span className="font-semibold text-sm">{scanMode ? 'Close Scanner' : 'Scan QR Code'}</span>}
          </button>
          <button
            onClick={handleExportData}
            className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-800`}
          >
            <span className="text-lg">📊</span>
            {!sidebarCollapsed && <span className="font-semibold text-sm">Export Data</span>}
          </button>

          {/* Recent Activity */}
          {!sidebarCollapsed && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-3">Recent Activity</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredSubmissions.slice(0, 5).map((sub, idx) => (
                  <div key={sub.id} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => handleVerifySubmission(sub)}>
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {(sub.userDetails.name || 'A')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{sub.userDetails.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{sub.serviceName}</p>
                    </div>
                  </div>
                ))}
                {filteredSubmissions.length === 0 && (
                  <p className="text-xs text-gray-500 px-3 italic">No recent activity</p>
                )}
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-gray-900 px-8 py-4 flex items-center justify-between border-b border-gray-800 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {!restrictedServiceId && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="w-64 h-10 pl-10 pr-4 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:bg-gray-800 transition-all placeholder:text-gray-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="relative w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {inbox.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {inbox.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0)}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {serviceName ? serviceName[0] : 'A'}
              </div>
              {!sidebarCollapsed && (
                <div className="hidden md:block">
                  <p className="font-bold text-white text-sm">{serviceName || 'Admin'}</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
            {Object.entries(STATUS_CONFIG).map(([key, config], idx) => {
              const count = filteredSubmissions.filter(s => (s.status || 'submitted') === key).length;
              const colors = ['border-t-cyan-500', 'border-t-amber-500', 'border-t-orange-500', 'border-t-emerald-500', 'border-t-teal-500', 'border-t-red-500'];
              const icons = ['⭐', '👤', '📋', '✅', '📦', '❌'];
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  className={`bg-white rounded-xl p-5 border-t-4 ${colors[idx]} hover:shadow-lg transition-all text-left ${
                    activeSection === key ? 'ring-2 ring-cyan-500 shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-3xl font-black text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">{config.label}</p>
                    </div>
                    <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center text-lg`}>
                      {icons[idx]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {scanMode && (
            <Card className="p-0 bg-black border-0 shadow-2xl overflow-hidden rounded-2xl relative aspect-video md:aspect-square max-w-md mx-auto mb-8">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none">
                <div className="w-full h-full border-2 border-cyan-400 relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-white" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-white" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-white" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-white" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-400 opacity-50 animate-pulse" />
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Align QR code within frame
                </p>
              </div>
            </Card>
          )}

          {/* Main Table Card */}
          <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{STATUS_CONFIG[activeSection].icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{STATUS_CONFIG[activeSection].label}</h2>
                  <p className="text-sm text-gray-500">{filteredSubmissions.filter(s => (s.status || 'submitted') === activeSection).length} total applications</p>
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    const statusSubmissions = filteredSubmissions.filter(s => (s.status || 'submitted') === activeSection);
                    if (statusSubmissions.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} className="px-6 py-20 text-center">
                            <div className="text-5xl mb-4">{STATUS_CONFIG[activeSection].icon}</div>
                            <p className="text-gray-400 font-semibold text-lg">No applications in {STATUS_CONFIG[activeSection].label}</p>
                            <p className="text-gray-300 text-sm mt-1">Applications will appear here when available</p>
                          </td>
                        </tr>
                      );
                    }
                    return statusSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {(submission.userDetails.name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{submission.userDetails.name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-400">{submission.userDetails.email || submission.userDetails.phone || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 font-medium">{submission.serviceName}</p>
                        </td>
                        <td className="px-6 py-4">
                          {submission.userDetails._district && submission.userDetails._state ? (
                            <p className="text-sm text-gray-600">{submission.userDetails._district}</p>
                          ) : (
                            <p className="text-sm text-gray-400">-</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[activeSection].bgColor} ${STATUS_CONFIG[activeSection].color}`}>
                            {STATUS_CONFIG[activeSection].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => handleVerifySubmission(submission)}
                            disabled={isVerifying}
                            size="sm"
                            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white h-9 px-4 rounded-lg font-semibold text-xs"
                          >
                            {verifyingId === submission.id ? 'Loading...' : 'View Details'}
                          </Button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {/* Messages Inbox Modal */}
      {showMessages && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border-0 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">Citizen Inbox</h3>
                  <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Incoming Service Queries</p>
                </div>
              </div>
              <Button onClick={() => setShowMessages(false)} variant="ghost" className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-full">✕</Button>
            </div>

            <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar bg-gray-50">
              {inbox.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 font-black uppercase tracking-[0.2em] italic">Inbox is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inbox.map((msg, idx) => (
                    <div
                      key={`${msg.userEmail}-${msg.serviceId}-${idx}`}
                      className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer group"
                      onClick={() => {
                        setActiveChat({ userEmail: msg.userEmail, serviceId: msg.serviceId, serviceName: msg.serviceName });
                        setShowMessages(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-50 to-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                            {msg.userEmail[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 leading-tight mb-0.5">{msg.userEmail}</p>
                            <span className="text-[10px] font-black bg-gradient-to-r from-cyan-50 to-purple-50 text-purple-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {msg.serviceName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          {msg.unreadCount > 0 && (
                            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center mb-2 ring-2 ring-white">
                              {msg.unreadCount}
                            </span>
                          )}
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Activity</p>
                          <p className="text-xs font-bold text-slate-600">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className={`mt-4 p-3 rounded-xl border-l-4 ${msg.unreadCount > 0 ? 'bg-indigo-50 border-indigo-600 font-bold' : 'bg-slate-50 border-indigo-400'}`}>
                        <p className={`text-sm ${msg.unreadCount > 0 ? 'text-indigo-900' : 'text-slate-600'} italic line-clamp-1`}>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Global Chat Overlay (Admin Side) */}
      {activeChat && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <MessageCenter
            serviceId={activeChat.serviceId}
            serviceName={activeChat.serviceName}
            userEmail={activeChat.userEmail}
            senderRole="admin"
            onClose={() => setActiveChat(null)}
          />
        </div>
      )}
      {/* Toast Notification */}
      {toast && toast.show && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right-10 duration-500">
          <Card className="bg-white border-l-8 border-l-red-500 shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-5 w-80 rounded-2xl flex items-start gap-4 ring-1 ring-slate-100">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Urgent Ticket</p>
                <button onClick={() => setToast(null)} className="text-slate-300 hover:text-slate-500 transition-colors">✕</button>
              </div>
              <p className="text-xs font-black text-slate-800 truncate mb-1">New Message from {toast.user}</p>
              <p className="text-xs text-slate-500 font-medium line-clamp-2 italic">{toast.msg}</p>
              <Button
                size="sm"
                onClick={() => {
                  const conv = inbox.find(i => i.userEmail === toast.user);
                  if (conv) {
                    setActiveChat({ userEmail: conv.userEmail, serviceId: conv.serviceId, serviceName: conv.serviceName });
                  }
                  setToast(null);
                }}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold h-8 text-[10px] rounded-lg"
              >
                Open Conversation
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle, Package } from 'lucide-react';

type SubmissionStatus = 'submitted' | 'under_review' | 'processing' | 'completed' | 'ready_for_collection' | 'collected' | 'rejected';

interface SubmittedService {
  id: string;
  serviceId: number;
  serviceName: string;
  qrCode: string;
  status?: SubmissionStatus;
  statusLabel?: string;
  submittedAt: number;
  isExpired?: boolean;
  userDetails: Record<string, string>;
  statusHistory?: Array<{
    status: string;
    changedAt: number;
    notes?: string;
  }>;
}

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle }> = {
  submitted: { label: 'Submitted', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Clock },
  under_review: { label: 'Under Review', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: AlertCircle },
  processing: { label: 'Processing', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: Clock },
  completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  ready_for_collection: { label: 'Ready for Collection', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: Package },
  collected: { label: 'Collected', color: 'text-gray-700', bgColor: 'bg-gray-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

export default function SubmissionDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [submission, setSubmission] = useState<SubmittedService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/submissions/${id}?viewer=user`);
        const data = await response.json();
        
        if (data.success) {
          setSubmission(data.submission);
          setLoading(false);
          return;
        }
        
        // If API fails, try URL query param (for offline/cross-device)
        const dataParam = searchParams.get('data');
        if (dataParam) {
          const base64 = dataParam.replace(/ /g, '+');
          const decoded = JSON.parse(atob(base64));
          setSubmission(decoded);
          setLoading(false);
          return;
        }

        // Fallback to localStorage
        const stored = localStorage.getItem('vaani_submissions');
        if (stored) {
          const submissions = JSON.parse(stored);
          const found = submissions.find((s: any) => s.id === id);
          if (found) {
            setSubmission(found);
            setLoading(false);
            return;
          }
        }

        setError(data.message || 'Submission not found.');
      } catch (e) {
        console.error('Error fetching submission:', e);
        setError('Error loading submission data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const status = submission?.status || 'submitted';
  const statusConfig = STATUS_CONFIG[status];
  const isFinal = status === 'collected' || status === 'rejected';
  const isExpired = submission?.isExpired || ['ready_for_collection', 'collected', 'rejected'].includes(status);
  const StatusIcon = statusConfig?.icon || Clock;

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">Application Status</h1>
          <p className="mt-2 text-sm text-gray-400">Official Government Service Submission Record</p>
        </div>

        {submission ? (
          <>
            {isExpired && (
              <div className="mb-6 p-6 bg-red-50 border-2 border-red-300 rounded-2xl animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <p className="text-lg font-black text-red-700 uppercase tracking-wide">Application Expired</p>
                </div>
                <p className="text-sm text-red-600 font-semibold">
                  This application has been processed and is no longer available for editing. 
                  {status === 'ready_for_collection' && ' Please visit the office to collect your document.'}
                </p>
              </div>
            )}

            <Card className="bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className={`${status === 'rejected' ? 'bg-red-600' : status === 'ready_for_collection' ? 'bg-emerald-600' : status === 'collected' ? 'bg-gray-600' : 'bg-gradient-to-r from-cyan-500 to-purple-600'} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-2 text-white">
                <StatusIcon className="h-6 w-6" />
                <span className="font-bold text-lg">{statusConfig?.label || status}</span>
              </div>
              <div className="text-white/80 text-xs font-mono hidden sm:block">
                ID: {submission.id.substring(0, 12)}...
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-8 border-b border-gray-100 pb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{submission.serviceName}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-medium text-sm border flex items-center gap-2 whitespace-nowrap ${statusConfig?.bgColor} ${statusConfig?.color} border-current/20`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig?.label}
                </div>
              </div>

              {/* Status-specific message */}
              {status === 'ready_for_collection' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-emerald-800 font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Your document is ready! Please visit the office to collect it.
                  </p>
                </div>
              )}
              
              {status === 'rejected' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Your application was rejected. Please contact the office for more details.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                {Object.entries(submission.userDetails)
                  .filter(([key]) => !key.startsWith('_'))
                  .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-gray-900 font-semibold text-lg break-words">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
                  </div>
                ))}
              </div>

              {/* Status History */}
              {submission.statusHistory && submission.statusHistory.length > 0 && (
                <div className="mb-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <h3 className="font-bold text-purple-800 mb-3">Status History</h3>
                  <div className="space-y-2">
                    {submission.statusHistory.slice().reverse().map((entry, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-purple-700 font-medium">
                          {STATUS_CONFIG[entry.status as SubmissionStatus]?.label || entry.status}
                        </span>
                        <span className="text-purple-500">{new Date(entry.changedAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-center gap-4">
                <Button onClick={() => window.print()} variant="outline" className="w-full md:w-auto px-6 border-gray-300 text-gray-700">
                  Print Receipt
                </Button>
                <Button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white w-full md:w-auto px-8 py-6 text-lg rounded-xl">
                  Start New Application
                </Button>
              </div>
            </div>
          </Card>
          </>
        ) : (
          <Card className="bg-white rounded-xl p-12 text-center animate-in fade-in duration-500">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Record Not Found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">{error || 'We could not locate this submission record.'}</p>
            <Button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-colors">
              Return to Home
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    LogOut,
    FileText,
    ChevronRight,
    History,
    Mail,
    UserCircle,
    Bell,
    AlertTriangle,
    ShieldCheck
} from 'lucide-react';
import { getAllActiveSubmissions } from '@/lib/qr-utils';
import type { SubmittedService } from '@/lib/government-services';
import { GOVERNMENT_SERVICES, getTranslatedService } from '@/lib/government-services';
import { MessageCenter } from '@/components/message-center';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserProfileDropdownProps {
    userEmail: string;
    onLogout: () => void;
    onGoToProfile: () => void;
    onViewForm: (submission: SubmittedService) => void;
    language?: any;
}

export const UserProfileDropdown = ({
    userEmail,
    onLogout,
    onGoToProfile,
    onViewForm,
    language
}: UserProfileDropdownProps) => {
    const router = useRouter();
    const { selectedLanguage } = useLanguage();
    const langCode = selectedLanguage?.code.split('-')[0] || 'en';
    const t = translations[langCode] || translations['en'];
    const [isOpen, setIsOpen] = useState(false);
    const [submissions, setSubmissions] = useState<SubmittedService[]>([]);
    const [showForms, setShowForms] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeChatService, setActiveChatService] = useState<{ id: number; name: string } | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchUserData = async () => {
            try {
                // Fetch unread messages
                const msgRes = await fetch(`/api/messages?userEmail=${userEmail}`, {
                    signal: controller.signal
                });
                if (!isMounted) return;
                const msgData = await msgRes.json();
                if (msgData.success) {
                    setAllMessages(msgData.messages);
                    const unread = msgData.messages.filter((m: any) => !m.read && m.sender === 'admin').length;
                    setUnreadCount(unread);
                }

                // Fetch notifications
                const notifRes = await fetch(`/api/notifications?userEmail=${userEmail}`, {
                    signal: controller.signal
                });
                if (!isMounted) return;
                const notifData = await notifRes.json();
                if (notifData.success) {
                    setNotifications(notifData.notifications);
                }
            } catch (error: any) {
                // Silently ignore network suspension/abort errors
                if (error.name === 'AbortError' || error.message?.includes('network') || error.message?.includes('suspended')) {
                    return;
                }
                // Only log unexpected errors
                if (isMounted) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
        const interval = setInterval(fetchUserData, 5000);
        return () => {
            isMounted = false;
            controller.abort();
            clearInterval(interval);
        };
    }, [userEmail]);

    const clearNotifications = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, action: 'clearAll' })
            });
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadData = async () => {
            try {
                const response = await fetch(`/api/submissions/user?email=${userEmail}`, {
                    signal: controller.signal
                });
                if (!isMounted) return;
                const data = await response.json();
                if (data.success) {
                    setSubmissions(data.submissions);
                }
            } catch (error: any) {
                // Silently ignore network suspension/abort errors
                if (error.name === 'AbortError' || error.message?.includes('network') || error.message?.includes('suspended')) {
                    return;
                }
                if (isMounted) {
                    console.error('Error loading user submissions:', error);
                }
            }
        };
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => {
            isMounted = false;
            controller.abort();
            clearInterval(interval);
        };
    }, [userEmail]);

    const userName = userEmail.split('@')[0] || 'User';

    return (
        <div className="relative">
            {/* Trigger Button - Circle Profile Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95"
            >
                <User className="h-6 w-6 text-slate-600" />
                {(unreadCount + notifications.filter(n => !n.read).length) > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-white animate-bounce">
                        {unreadCount + notifications.filter(n => !n.read).length}
                    </span>
                ) : submissions.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-black text-white ring-2 ring-white">
                        {submissions.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setShowForms(false); setShowMessages(false); }} />
                    <Card className="absolute right-0 mt-3 w-80 bg-black backdrop-blur-xl border border-neutral-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* User Info Header */}
                        <div className="p-6 pb-5 bg-neutral-900 border-b border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                                    {userName[0].toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-black text-white text-lg leading-tight uppercase tracking-tight truncate">{userName}</p>
                                    <p className="text-xs text-neutral-400 font-bold truncate">{userEmail}</p>
                                </div>
                            </div>
                        </div>

                        <div className="py-3">
                            {/* My Account */}
                            <button
                                onClick={() => { onGoToProfile(); setIsOpen(false); }}
                                className="w-full flex items-center gap-4 px-6 py-4 text-white hover:bg-neutral-800 transition-all text-left font-bold group"
                            >
                                <UserCircle className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                <span className="text-sm">{t.myAccount}</span>
                            </button>

                            {/* My Forms */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowForms(!showForms); setShowMessages(false); }}
                                    className={`w-full flex items-center justify-between px-6 py-4 text-white hover:bg-neutral-800 transition-all text-left font-bold group ${showForms ? 'bg-neutral-800' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <FileText className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                        <span className="text-sm">{t.activeForms}</span>
                                    </div>
                                    <ChevronRight className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${showForms ? 'rotate-90' : ''}`} />
                                </button>

                                {/* Inline Form List */}
                                {showForms && (
                                    <div className="bg-neutral-900 border-y border-neutral-800 max-h-56 overflow-y-auto custom-scrollbar">
                                        {submissions.length === 0 ? (
                                            <div className="px-10 py-6 text-center">
                                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] italic">{t.noActiveApplications}</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-neutral-800">
                                                {submissions.map((sub) => {
                                                    const serviceDef = GOVERNMENT_SERVICES.find(s => s.id === sub.serviceId);
                                                    const serviceName = serviceDef ? getTranslatedService(serviceDef, langCode).name : sub.serviceName;
                                                    
                                                    return (
                                                    <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-800 transition-all group">
                                                        <button
                                                            onClick={() => {
                                                                onViewForm(sub);
                                                                setIsOpen(false);
                                                            }}
                                                            className="flex-1 text-left"
                                                        >
                                                            <p className="text-xs font-black text-white truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{serviceName}</p>
                                                            <p className="text-[10px] text-neutral-400 font-bold tracking-wider">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveChatService({ id: sub.serviceId, name: sub.serviceName });
                                                            }}
                                                            className="p-2.5 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all shadow-sm"
                                                            title="Message Admin"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Notifications section */}
                            <div className="relative border-b border-neutral-800">
                                <button
                                    onClick={() => { setShowNotifications(!showNotifications); setShowForms(false); setShowMessages(false); }}
                                    className={`w-full flex items-center justify-between px-6 py-4 text-white hover:bg-neutral-800 transition-all text-left font-bold group ${showNotifications ? 'bg-neutral-800' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${showNotifications ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-orange-400 group-hover:bg-neutral-700'}`}>
                                            <Bell className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm">{t.notifications}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {notifications.filter(n => !n.read).length > 0 && (
                                            <div className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-black">
                                                {notifications.filter(n => !n.read).length}
                                            </div>
                                        )}
                                        <ChevronRight className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${showNotifications ? 'rotate-90' : ''}`} />
                                    </div>
                                </button>

                                {showNotifications && (
                                    <div className="bg-neutral-900 p-3 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-10 text-center">
                                                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3 opacity-50">
                                                    <Bell className="w-6 h-6 text-neutral-400" />
                                                </div>
                                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{t.noAlerts}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center px-1 mb-2">
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t.recentActivity}</p>
                                                    <button onClick={clearNotifications} className="text-[9px] font-black text-cyan-400 uppercase hover:text-cyan-300 hover:underline transition-all">{t.clearAll}</button>
                                                </div>
                                                <div className="space-y-2">
                                                    {notifications.map((notif) => (
                                                        <div key={notif.id} className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${notif.type === 'warning' ? 'bg-orange-900/30 border-orange-800' : 'bg-neutral-800 border-neutral-700'} shadow-sm`}>
                                                            <div className="flex items-start gap-4">
                                                                <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${notif.type === 'warning' ? 'bg-orange-900/50 text-orange-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                                                                    {notif.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-black text-white leading-tight mb-1 truncate">{notif.title}</p>
                                                                    <p className="text-[11px] text-neutral-400 font-medium leading-relaxed mb-2 opacity-80">{notif.message}</p>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${notif.type === 'warning' ? 'bg-orange-900/50 text-orange-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                                                                            {notif.serviceName}
                                                                        </span>
                                                                        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-tighter">
                                                                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Contact  */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowMessages(!showMessages); setShowForms(false); }}
                                    className={`w-full flex items-center justify-between px-6 py-4 text-white hover:bg-neutral-800 transition-all text-left font-bold group ${showMessages ? 'bg-neutral-800' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Mail className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        <span className="text-sm">{t.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 ? (
                                            <div className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-black">
                                                {unreadCount}
                                            </div>
                                        ) : (
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                        )}
                                        <ChevronRight className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${showMessages ? 'rotate-90' : ''}`} />
                                    </div>
                                </button>

                                {showMessages && (
                                    <div className="bg-neutral-900 border-y border-neutral-800 p-4 space-y-3">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2">{t.selectDepartment}</p>
                                        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                            {GOVERNMENT_SERVICES.map((service) => {
                                                const hasUnread = allMessages.some(m => m.serviceId === service.id && !m.read && m.sender === 'admin');
                                                const translatedService = getTranslatedService(service, langCode);
                                                return (
                                                    <button
                                                        key={service.id}
                                                        onClick={() => setActiveChatService({ id: service.id, name: service.name })}
                                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{service.icon}</span>
                                                                {hasUnread && (
                                                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-1 ring-black"></span>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white truncate max-w-[160px]">{translatedService.name}</span>
                                                        </div>
                                                        <ChevronRight className={`h-3 w-3 ${hasUnread ? 'text-red-400' : 'text-neutral-500'} group-hover:text-cyan-400`} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logout Footer */}
                        <div className="mt-1 border-t border-neutral-800 p-2">
                            <button
                                onClick={() => { onLogout(); setIsOpen(false); }}
                                className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-900/30 rounded-2xl transition-all text-left font-bold group"
                            >
                                <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                <span className="text-sm">{t.logout}</span>
                            </button>
                        </div>

                    </Card>
                </>
            )}

            {/* Global Chat Overlay */}
            {activeChatService && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <MessageCenter
                        serviceId={activeChatService.id}
                        serviceName={activeChatService.name}
                        userEmail={userEmail}
                        senderRole="user"
                        onClose={() => setActiveChatService(null)}
                    />
                </div>,
                document.body
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminDashboard } from '@/components/admin-dashboard';
import { ADMIN_CREDENTIALS, AdminUser } from '@/lib/admin-auth';
import { MasterAdminDashboard } from '@/components/master-admin-dashboard';
import { INDIAN_STATES } from '@/lib/indian-locations';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Mail, AlertCircle, MapPin, Building } from 'lucide-react';

interface AdminSession extends AdminUser {
    selectedState: string;
    selectedDistrict: string;
}

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminInfo, setAdminInfo] = useState<AdminSession | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get districts for selected state
    const availableDistricts = useMemo(() => {
        if (!selectedState) return [];
        const state = INDIAN_STATES.find(s => s.name === selectedState);
        return state?.districts || [];
    }, [selectedState]);

    useEffect(() => {
        // Check for existing session
        const savedAdmin = localStorage.getItem('vaani_admin_session');
        if (savedAdmin) {
            try {
                const info = JSON.parse(savedAdmin);
                setAdminInfo(info);
                setIsLoggedIn(true);
            } catch (e) {
                localStorage.removeItem('vaani_admin_session');
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const emailLower = email.toLowerCase().trim();
        const isMasterAdmin = emailLower === 'master.admin@vaani.gov.in';

        // Validate state and district selection only for non-master admins
        if (!isMasterAdmin && (!selectedState || !selectedDistrict)) {
            setError('Please select your State and District to proceed.');
            return;
        }

        const admin = ADMIN_CREDENTIALS[emailLower];

        if (admin && admin.password === password) {
            const sessionData: AdminSession = {
                ...admin,
                selectedState: isMasterAdmin ? 'ALL' : selectedState,
                selectedDistrict: isMasterAdmin ? 'ALL' : selectedDistrict
            };
            setAdminInfo(sessionData);
            setIsLoggedIn(true);
            localStorage.setItem('vaani_admin_session', JSON.stringify(sessionData));
        } else {
            setError('Invalid email or password. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAdminInfo(null);
        localStorage.removeItem('vaani_admin_session');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isLoggedIn && adminInfo) {
        const isMasterAdmin = adminInfo.email.toLowerCase().trim() === 'master.admin@vaani.gov.in';

        if (isMasterAdmin) {
            return (
                <MasterAdminDashboard onLogout={handleLogout} />
            );
        }

        return (
            <div className="min-h-screen bg-black pt-10 px-4">
                <AdminDashboard
                    restrictedServiceId={adminInfo.serviceId}
                    serviceName={adminInfo.serviceName}
                    adminState={adminInfo.selectedState}
                    adminDistrict={adminInfo.selectedDistrict}
                    onLogout={handleLogout}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px]"></div>
            </div>

            <Card className="w-full max-w-md p-8 bg-white border-0 rounded-[32px] relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white shadow-xl shadow-purple-500/10 rounded-[28px] mb-6 overflow-hidden p-1 border border-gray-100">
                        <img src="/logo.jpeg" alt="Vaani Logo" className="w-full h-full object-cover rounded-[24px]" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-gray-500 font-medium">Please sign in to access your application management panel</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Official Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="service.admin@vaani.gov.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-14 pl-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-2xl transition-all text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-14 pl-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-2xl transition-all text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Hide State and District for Master Admin */}
                    {email.toLowerCase().trim() !== 'master.admin@vaani.gov.in' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Select State</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={selectedState}
                                        onChange={(e) => {
                                            setSelectedState(e.target.value);
                                            setSelectedDistrict('');
                                        }}
                                        required
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-2xl transition-all appearance-none cursor-pointer text-gray-700"
                                    >
                                        <option value="">-- Select State --</option>
                                        {INDIAN_STATES.map(state => (
                                            <option key={state.code} value={state.name}>{state.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Select District</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        required
                                        disabled={!selectedState}
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-2xl transition-all appearance-none cursor-pointer text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">-- Select District --</option>
                                        {availableDistricts.map(district => (
                                            <option key={district.name} value={district.name}>{district.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 font-bold">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-black text-lg rounded-2xl transition-all active:scale-[0.98] border-0"
                    >
                        Sign In to Panel
                    </Button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Vaani AI Secure Administration
                    </p>
                </div>
            </Card>
        </div>
    );
}

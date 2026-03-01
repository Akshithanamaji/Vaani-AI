'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users,
    CheckCircle2,
    Clock,
    AlertTriangle,
    MapPin,
    Building2,
    Search,
    ArrowRight,
    Filter,
    BarChart3,
    TrendingUp,
    Globe
} from 'lucide-react';
import { GOVERNMENT_SERVICES } from '@/lib/government-services';
import { INDIAN_STATES } from '@/lib/indian-locations';
import { AnalyticsDashboard } from './analytics-dashboard';

interface MasterAdminDashboardProps {
    onLogout?: () => void;
}

export const MasterAdminDashboard = ({ onLogout }: MasterAdminDashboardProps) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterState, setFilterState] = useState('ALL');
    const [filterDistrict, setFilterDistrict] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'dashboard' | 'analytics' | 'matrix'>('dashboard');

    const loadSubmissions = async () => {
        try {
            const response = await fetch('/api/submissions/list');
            const data = await response.json();
            if (data.success) {
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error('Error loading submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
        const interval = setInterval(loadSubmissions, 10000);
        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => {
        const total = submissions.length;
        const completed = submissions.filter(s => ['completed', 'ready_for_collection', 'collected'].includes(s.status)).length;
        const pending = submissions.filter(s => ['submitted', 'under_review', 'processing'].includes(s.status)).length;
        const rejected = submissions.filter(s => s.status === 'rejected').length;

        return { total, completed, pending, rejected };
    }, [submissions]);

    const locationMatrix = useMemo(() => {
        const matrix: Record<string, Record<string, { total: number; completed: number; pending: number }>> = {};

        submissions.forEach(sub => {
            const state = sub.userDetails?._state || 'Unknown';
            const district = sub.userDetails?._district || 'Unknown';

            if (!matrix[state]) matrix[state] = {};
            if (!matrix[state][district]) matrix[state][district] = { total: 0, completed: 0, pending: 0 };

            matrix[state][district].total++;
            if (['completed', 'ready_for_collection', 'collected'].includes(sub.status)) {
                matrix[state][district].completed++;
            } else if (['submitted', 'under_review', 'processing'].includes(sub.status)) {
                matrix[state][district].pending++;
            }
        });

        return matrix;
    }, [submissions]);

    const serviceMatrix = useMemo(() => {
        const matrix: Record<number, { name: string; total: number; completed: number; pending: number }> = {};

        GOVERNMENT_SERVICES.forEach(s => {
            matrix[s.id] = { name: s.name, total: 0, completed: 0, pending: 0 };
        });

        submissions.forEach(sub => {
            if (matrix[sub.serviceId]) {
                matrix[sub.serviceId].total++;
                if (['completed', 'ready_for_collection', 'collected'].includes(sub.status)) {
                    matrix[sub.serviceId].completed++;
                } else if (['submitted', 'under_review', 'processing'].includes(sub.status)) {
                    matrix[sub.serviceId].pending++;
                }
            }
        });

        return Object.values(matrix).sort((a, b) => b.total - a.total);
    }, [submissions]);

    const availableDistricts = useMemo(() => {
        if (filterState === 'ALL') return [];
        const state = INDIAN_STATES.find(s => s.name === filterState);
        return state?.districts || [];
    }, [filterState]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500/30">
            {/* Premium Navigation Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10 overflow-hidden border border-white/10">
                            <img src="/logo.jpeg" alt="Vaani Logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                                Head of Government
                            </h1>
                            <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em]">National Command Center</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setViewMode('dashboard')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'dashboard' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setViewMode('matrix')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'matrix' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Service Matrix
                        </button>
                        <button
                            onClick={() => setViewMode('analytics')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'analytics' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Analytics
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-bold text-white">Master Admin</p>
                            <p className="text-xs text-gray-500">Gov. ID: VAANI-MASTER-01</p>
                        </div>
                        {onLogout && (
                            <Button onClick={onLogout} variant="ghost" className="rounded-xl border border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 px-6 font-bold h-11 transition-all">
                                Exit Portal
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">

                {viewMode === 'dashboard' && (
                    <>
                        {/* KPI Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Applications', value: stats.total, icon: Users, color: 'cyan', sub: 'Across all 55 services' },
                                { label: 'Successfully Completed', value: stats.completed, icon: CheckCircle2, color: 'emerald', sub: 'Verified & Issued' },
                                { label: 'Awaiting Action', value: stats.pending, icon: Clock, color: 'amber', sub: 'Pending in workflow' },
                                { label: 'Applications Rejected', value: stats.rejected, icon: AlertTriangle, color: 'red', sub: 'Documentation issues' },
                            ].map((kpi, i) => (
                                <Card key={i} className="bg-neutral-900 border-white/5 p-6 rounded-[24px] overflow-hidden group hover:border-white/10 transition-all relative">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${kpi.color}-500/5 blur-[50px] rounded-full -mr-16 -mt-16`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 bg-${kpi.color}-500/10 rounded-2xl flex items-center justify-center mb-6 border border-${kpi.color}-500/20`}>
                                            <kpi.icon className={`w-6 h-6 text-${kpi.color}-400`} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                                        <p className="text-4xl font-black text-white tracking-tighter mb-2">{kpi.value.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 font-medium">{kpi.sub}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Performance Matrix */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 bg-neutral-900 border-white/5 rounded-[32px] overflow-hidden">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                                            National Service Performance
                                        </h3>
                                        <p className="text-sm text-gray-500">Live breakdown by state and district</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <select
                                            value={filterState}
                                            onChange={(e) => { setFilterState(e.target.value); setFilterDistrict('ALL'); }}
                                            className="bg-neutral-800 border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                        >
                                            <option value="ALL">All States</option>
                                            {INDIAN_STATES.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                                        </select>
                                        {filterState !== 'ALL' && (
                                            <select
                                                value={filterDistrict}
                                                onChange={(e) => setFilterDistrict(e.target.value)}
                                                className="bg-neutral-800 border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                            >
                                                <option value="ALL">All Districts</option>
                                                {availableDistricts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <tr>
                                                <th className="px-8 py-4">State</th>
                                                <th className="px-8 py-4">District</th>
                                                <th className="px-8 py-4">Total</th>
                                                <th className="px-8 py-4">Completed</th>
                                                <th className="px-8 py-4">Pending</th>
                                                <th className="px-8 py-4">Efficiency</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {Object.entries(locationMatrix)
                                                .filter(([state]) => filterState === 'ALL' || state === filterState)
                                                .flatMap(([state, districts]) =>
                                                    Object.entries(districts)
                                                        .filter(([district]) => filterDistrict === 'ALL' || district === filterDistrict)
                                                        .map(([district, data], idx) => {
                                                            const efficiency = Math.round((data.completed / data.total) * 100) || 0;
                                                            return (
                                                                <tr key={`${state}-${district}`} className="hover:bg-white/5 transition-colors group">
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                                                                {state[0]}
                                                                            </div>
                                                                            <span className="font-bold text-sm">{state}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <span className="text-sm text-gray-400 font-medium">{district}</span>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <span className="text-sm font-black text-white">{data.total}</span>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <span className="text-sm font-bold text-emerald-400">{data.completed}</span>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <span className="text-sm font-bold text-amber-400">{data.pending}</span>
                                                                    </td>
                                                                    <td className="px-8 py-4">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full w-24 overflow-hidden">
                                                                                <div
                                                                                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000"
                                                                                    style={{ width: `${efficiency}%` }}
                                                                                ></div>
                                                                            </div>
                                                                            <span className="text-xs font-black text-gray-300">{efficiency}%</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                ).slice(0, 10)}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 border-t border-white/5 text-center">
                                    <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 font-bold text-sm gap-2">
                                        View Comprehensive Report <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>

                            <Card className="bg-neutral-900 border-white/5 rounded-[32px] p-8">
                                <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                                    <BarChart3 className="w-5 h-5 text-purple-400" />
                                    High Priority Services
                                </h3>
                                <div className="space-y-6">
                                    {serviceMatrix.slice(0, 8).map((service, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                                                <span className="text-white truncate max-w-[180px]">{service.name}</span>
                                                <span>{service.total} total</span>
                                            </div>
                                            <div className="flex h-3 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-700"
                                                    style={{ width: `${(service.completed / service.total) * 100 || 0}%` }}
                                                    title="Completed"
                                                ></div>
                                                <div
                                                    className="h-full bg-amber-500 transition-all duration-700"
                                                    style={{ width: `${(service.pending / service.total) * 100 || 0}%` }}
                                                    title="Pending"
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                                                <span>{service.completed} Done</span>
                                                <span>{service.pending} Pending</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {viewMode === 'matrix' && (
                    <Card className="bg-neutral-900 border-white/5 rounded-[32px] overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h3 className="text-2xl font-black">All Service Matrix</h3>
                                <p className="text-sm text-gray-500">Complete visibility across 55 government applications</p>
                            </div>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                    placeholder="Filter by service name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 bg-neutral-800 border-white/5 rounded-2xl focus:ring-cyan-500/50"
                                />
                            </div>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-8 py-4"># ID</th>
                                        <th className="px-8 py-4">Service Name</th>
                                        <th className="px-8 py-4">Category</th>
                                        <th className="px-8 py-4">Total App.</th>
                                        <th className="px-8 py-4">Pending</th>
                                        <th className="px-8 py-4">Completed</th>
                                        <th className="px-8 py-4">Success Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {serviceMatrix
                                        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((service, idx) => {
                                            const sDef = GOVERNMENT_SERVICES.find(gs => gs.name === service.name);
                                            const rate = Math.round((service.completed / service.total) * 100) || 0;
                                            return (
                                                <tr key={idx} className="hover:bg-white/5 transition-all group">
                                                    <td className="px-8 py-4">
                                                        <span className="text-xs font-black text-gray-600">#{sDef?.id || idx + 1}</span>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <p className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">{service.name}</p>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded-md text-gray-400 uppercase tracking-wider">
                                                            {sDef?.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 font-black">{service.total}</td>
                                                    <td className="px-8 py-4 text-amber-500 font-bold">{service.pending}</td>
                                                    <td className="px-8 py-4 text-emerald-500 font-bold">{service.completed}</td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full w-20">
                                                                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${rate}%` }}></div>
                                                            </div>
                                                            <span className={`text-xs font-black ${rate > 70 ? 'text-emerald-400' : rate > 30 ? 'text-amber-400' : 'text-gray-500'}`}>{rate}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {viewMode === 'analytics' && (
                    <div className="bg-neutral-900 border border-white/5 rounded-[40px] p-10">
                        <AnalyticsDashboard />
                    </div>
                )}

            </main>

            <footer className="max-w-[1600px] mx-auto px-8 py-20 border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-4">
                    Ministry of Digital Transformation & Good Governance
                </p>
                <p className="text-gray-500 text-sm font-medium">© 2026 Vaani AI - National Governance Command Center (NGCC)</p>
            </footer>
        </div>
    );
};

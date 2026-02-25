'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ServiceStat { name: string; id: number; count: number; pct: number; }
interface LanguageStat { lang: string; count: number; pct: number; }
interface DistrictStat { district: string; state: string; count: number; pct: number; }
interface DayTrend { date: string; count: number; }
interface CategoryStat { cat: string; count: number; pct: number; }

interface Analytics {
    total: number;
    completed: number;
    rejected: number;
    pending: number;
    approvalRate: number;
    serviceStats: ServiceStat[];
    languageStats: LanguageStat[];
    districtStats: DistrictStat[];
    statusCount: Record<string, number>;
    dailyTrend: DayTrend[];
    categoryStats: CategoryStat[];
}

interface Props {
    adminState?: string;
    adminDistrict?: string;
    restrictedServiceId?: number;
}

// ─── Colour palettes ─────────────────────────────────────────────────────────
const SERVICE_COLOURS = [
    '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
];

const LANG_COLOURS: Record<string, string> = {
    English: '#06b6d4', Hindi: '#8b5cf6', Telugu: '#10b981',
    Kannada: '#f59e0b', Tamil: '#ef4444', Malayalam: '#3b82f6',
    Marathi: '#ec4899', Bengali: '#14b8a6', Gujarati: '#f97316',
    Punjabi: '#6366f1', Odia: '#a855f7', Urdu: '#64748b',
};

const STATUS_COLOURS: Record<string, string> = {
    submitted: '#3b82f6', under_review: '#f59e0b', processing: '#f97316',
    completed: '#10b981', ready_for_collection: '#14b8a6', collected: '#6366f1', rejected: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted', under_review: 'Under Review', processing: 'Processing',
    completed: 'Completed', ready_for_collection: 'Ready', collected: 'Collected', rejected: 'Rejected',
};

// ─── Mini Bar component ───────────────────────────────────────────────────────
function Bar({ pct, colour, delay = 0 }: { pct: number; colour: string; delay?: number }) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(pct), 100 + delay);
        return () => clearTimeout(t);
    }, [pct, delay]);
    return (
        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${width}%`, backgroundColor: colour }}
            />
        </div>
    );
}

// ─── Sparkline (SVG) ─────────────────────────────────────────────────────────
function Sparkline({ data, colour }: { data: DayTrend[]; colour: string }) {
    const max = Math.max(...data.map(d => d.count), 1);
    const W = 300; const H = 60;
    const pts = data.map((d, i) => ({
        x: (i / (data.length - 1)) * W,
        y: H - (d.count / max) * (H - 8) - 4,
    }));
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const area = `${path} L ${W} ${H} L 0 ${H} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`sg-${colour.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colour} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={colour} stopOpacity={0.02} />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#sg-${colour.replace('#', '')})`} />
            <path d={path} fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill={colour} opacity={0.8} />
            ))}
        </svg>
    );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────
function Donut({ data, colours, size = 140 }: { data: { label: string; value: number }[]; colours: string[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return <div className="flex items-center justify-center text-white/30 text-sm" style={{ width: size, height: size }}>No data</div>;

    const R = size / 2 - 10;
    const cx = size / 2; const cy = size / 2;
    let cumulative = 0;

    const slices = data.map((d, i) => {
        const start = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        cumulative += d.value;
        const end = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        const gap = 0.03;
        const x1 = cx + R * Math.cos(start + gap);
        const y1 = cy + R * Math.sin(start + gap);
        const x2 = cx + R * Math.cos(end - gap);
        const y2 = cy + R * Math.sin(end - gap);
        const large = end - start > Math.PI ? 1 : 0;
        return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`, colour: colours[i % colours.length], label: d.label, value: d.value };
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((s, i) => (
                <path key={i} d={s.path} fill={s.colour} opacity={0.9}>
                    <title>{s.label}: {s.value}</title>
                </path>
            ))}
            <circle cx={cx} cy={cy} r={R * 0.55} fill="#111827" />
            <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={size * 0.14} fontWeight="bold">{total}</text>
            <text x={cx} y={cy + size * 0.1} textAnchor="middle" fill="#9ca3af" fontSize={size * 0.08}>total</text>
        </svg>
    );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, colour, icon }: { label: string; value: number | string; sub?: string; colour: string; icon: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gray-900 border border-white/5 hover:border-white/10 transition-all group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${colour}15, transparent 70%)` }}
            />
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colour }}>{label}</span>
                </div>
                <p className="text-4xl font-black text-white">{value}</p>
                {sub && <p className="text-xs text-gray-500 mt-1 font-medium">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AnalyticsDashboard({ adminState, adminDistrict, restrictedServiceId }: Props) {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'languages' | 'districts' | 'trends'>('overview');

    const fetchAnalytics = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (adminState) params.set('state', adminState);
            if (adminDistrict) params.set('district', adminDistrict);
            if (restrictedServiceId) params.set('serviceId', String(restrictedServiceId));

            const res = await fetch(`/api/analytics?${params}`);
            const data = await res.json();
            if (data.success) {
                setAnalytics(data.analytics);
                setLastUpdated(new Date());
            }
        } catch (e) {
            console.error('Analytics fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, [adminState, adminDistrict, restrictedServiceId]);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30_000);
        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium">Computing analytics…</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                Failed to load analytics. Please try again.
            </div>
        );
    }

    const topService = analytics.serviceStats[0];
    const topLang = analytics.languageStats[0];
    const topDistrict = analytics.districtStats[0];
    const todayCount = analytics.dailyTrend[analytics.dailyTrend.length - 1]?.count ?? 0;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'services', label: 'Services', icon: '🏛️' },
        { id: 'languages', label: 'Languages', icon: '🌐' },
        { id: 'districts', label: 'Districts', icon: '📍' },
        { id: 'trends', label: 'Trends', icon: '📈' },
    ] as const;

    return (
        <div className="space-y-6">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {adminDistrict ? `${adminDistrict}, ${adminState}` : adminState || 'All Regions'} ·{' '}
                        {lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString()}</span>}
                    </p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
                >
                    <span className="text-base">🔄</span> Refresh
                </button>
            </div>

            {/* ── KPI Row ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" value={analytics.total} sub="All submissions" colour="#06b6d4" icon="📋" />
                <StatCard label="Pending" value={analytics.pending} sub="Awaiting action" colour="#f59e0b" icon="⏳" />
                <StatCard label="Completed" value={analytics.completed} sub="Resolved successfully" colour="#10b981" icon="✅" />
                <StatCard label="Today" value={todayCount} sub="Submissions today" colour="#8b5cf6" icon="📅" />
            </div>

            {/* ── Approval rate bar ───────────────────────────────────────────── */}
            <div className="rounded-2xl bg-gray-900 border border-white/5 p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Approval Rate</p>
                    <span className="text-2xl font-black text-emerald-400">{analytics.approvalRate}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    {(['completed', 'ready_for_collection', 'collected'] as const).map(s => {
                        const cnt = analytics.statusCount[s] || 0;
                        const pct = analytics.total ? (cnt / analytics.total) * 100 : 0;
                        return pct > 0 ? (
                            <div key={s} className="h-full transition-all duration-700"
                                style={{ width: `${pct}%`, backgroundColor: STATUS_COLOURS[s] }}>
                                <title>{STATUS_LABELS[s]}: {cnt}</title>
                            </div>
                        ) : null;
                    })}
                    {(analytics.statusCount.rejected || 0) > 0 && (
                        <div className="h-full bg-red-500 transition-all duration-700"
                            style={{ width: `${((analytics.statusCount.rejected || 0) / analytics.total) * 100}%` }}>
                            <title>Rejected</title>
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                    {Object.entries(STATUS_COLOURS).map(([status, colour]) => {
                        const cnt = analytics.statusCount[status] || 0;
                        return cnt > 0 ? (
                            <div key={status} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colour }} />
                                <span className="text-xs text-gray-400">{STATUS_LABELS[status] || status}: <span className="text-white font-bold">{cnt}</span></span>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>

            {/* ── Tab Nav ─────────────────────────────────────────────────────── */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20'
                                : 'bg-gray-900 border border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                            }`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Top insight cards */}
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-all">
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">🏆 Most Used Service</p>
                        {topService ? (
                            <>
                                <p className="text-lg font-black text-white leading-tight mb-1">{topService.name}</p>
                                <p className="text-sm text-gray-400">{topService.count} submissions · {topService.pct}% of total</p>
                                <Bar pct={topService.pct} colour="#06b6d4" delay={0} />
                            </>
                        ) : <p className="text-gray-500 text-sm">No data yet</p>}
                    </div>

                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">🌐 Top Language</p>
                        {topLang ? (
                            <>
                                <p className="text-lg font-black text-white leading-tight mb-1">{topLang.lang}</p>
                                <p className="text-sm text-gray-400">{topLang.count} users · {topLang.pct}% of total</p>
                                <Bar pct={topLang.pct} colour={LANG_COLOURS[topLang.lang] || '#8b5cf6'} delay={100} />
                            </>
                        ) : <p className="text-gray-500 text-sm">No data yet</p>}
                    </div>

                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">📍 Top District</p>
                        {topDistrict ? (
                            <>
                                <p className="text-lg font-black text-white leading-tight mb-1">{topDistrict.district}</p>
                                <p className="text-sm text-gray-400">{topDistrict.state} · {topDistrict.count} submissions</p>
                                <Bar pct={topDistrict.pct} colour="#10b981" delay={200} />
                            </>
                        ) : <p className="text-gray-500 text-sm">No data yet</p>}
                    </div>

                    {/* Mini donut for status */}
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-4 md:col-span-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest self-start">Status Spread</p>
                        <Donut
                            data={Object.entries(analytics.statusCount).map(([k, v]) => ({ label: STATUS_LABELS[k] || k, value: v }))}
                            colours={Object.values(STATUS_COLOURS)}
                            size={130}
                        />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
                            {Object.entries(analytics.statusCount).map(([status, cnt]) => (
                                <div key={status} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLOURS[status] || '#6b7280' }} />
                                    <span className="text-xs text-gray-400 truncate">{STATUS_LABELS[status] || status}: <span className="text-white font-semibold">{cnt}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mini sparkline in overview */}
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 md:col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">14-Day Submission Trend</p>
                        <div className="h-16 mb-3">
                            <Sparkline data={analytics.dailyTrend} colour="#06b6d4" />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{analytics.dailyTrend[0]?.date}</span>
                            <span>{analytics.dailyTrend[analytics.dailyTrend.length - 1]?.date}</span>
                        </div>
                    </div>

                    {/* Category donut */}
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 md:col-span-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest self-start">By Category</p>
                        <Donut
                            data={analytics.categoryStats.map(c => ({ label: c.cat, value: c.count }))}
                            colours={SERVICE_COLOURS}
                            size={120}
                        />
                        <div className="space-y-1 w-full">
                            {analytics.categoryStats.slice(0, 5).map((c, i) => (
                                <div key={c.cat} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SERVICE_COLOURS[i % SERVICE_COLOURS.length] }} />
                                        <span className="text-gray-400">{c.cat}</span>
                                    </div>
                                    <span className="text-white font-bold">{c.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rejection insights */}
                    <div className="bg-gray-900 border border-red-500/10 rounded-2xl p-5 md:col-span-2">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Rejection & Completion Insights</p>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Rejection Rate', value: `${analytics.total ? Math.round((analytics.rejected / analytics.total) * 100) : 0}%`, colour: '#ef4444' },
                                { label: 'Approval Rate', value: `${analytics.approvalRate}%`, colour: '#10b981' },
                                { label: 'Pending Rate', value: `${analytics.total ? Math.round((analytics.pending / analytics.total) * 100) : 0}%`, colour: '#f59e0b' },
                            ].map(item => (
                                <div key={item.label} className="text-center">
                                    <p className="text-3xl font-black" style={{ color: item.colour }}>{item.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
          SERVICES TAB
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'services' && (
                <div className="space-y-4">
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Most Used Services</p>
                        {analytics.serviceStats.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">No service data available yet</p>
                        ) : (
                            <div className="space-y-4">
                                {analytics.serviceStats.slice(0, 12).map((s, i) => (
                                    <div key={s.name} className="group">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                                                    style={{ backgroundColor: SERVICE_COLOURS[i % SERVICE_COLOURS.length] }}>
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate max-w-xs">{s.name}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500">{s.pct}%</span>
                                                <span className="text-sm font-black text-white min-w-[2rem] text-right">{s.count}</span>
                                            </div>
                                        </div>
                                        <Bar pct={s.pct} colour={SERVICE_COLOURS[i % SERVICE_COLOURS.length]} delay={i * 50} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Service category breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">By Category</p>
                            <div className="space-y-3">
                                {analytics.categoryStats.map((c, i) => (
                                    <div key={c.cat}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-300">{c.cat}</span>
                                            <span className="text-sm font-bold text-white">{c.count}</span>
                                        </div>
                                        <Bar pct={c.pct} colour={SERVICE_COLOURS[i % SERVICE_COLOURS.length]} delay={i * 60} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 self-start">Service Distribution</p>
                            <Donut
                                data={analytics.serviceStats.slice(0, 8).map(s => ({ label: s.name, value: s.count }))}
                                colours={SERVICE_COLOURS}
                                size={160}
                            />
                            <div className="grid grid-cols-1 gap-1 w-full mt-4">
                                {analytics.serviceStats.slice(0, 5).map((s, i) => (
                                    <div key={s.name} className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SERVICE_COLOURS[i] }} />
                                        <span className="text-gray-400 truncate flex-1">{s.name}</span>
                                        <span className="text-white font-bold">{s.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
          LANGUAGES TAB
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'languages' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Language Usage Breakdown</p>
                        {analytics.languageStats.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">No language data yet</p>
                        ) : (
                            <div className="space-y-5">
                                {analytics.languageStats.map((l, i) => {
                                    const colour = LANG_COLOURS[l.lang] || SERVICE_COLOURS[i % SERVICE_COLOURS.length];
                                    return (
                                        <div key={l.lang}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colour }} />
                                                    <span className="text-sm font-semibold text-white">{l.lang}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-gray-500 font-medium">{l.pct}%</span>
                                                    <span className="text-sm font-black" style={{ color: colour }}>{l.count}</span>
                                                </div>
                                            </div>
                                            <Bar pct={l.pct} colour={colour} delay={i * 60} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 self-start">Language Distribution</p>
                            <Donut
                                data={analytics.languageStats.map(l => ({ label: l.lang, value: l.count }))}
                                colours={analytics.languageStats.map(l => LANG_COLOURS[l.lang] || '#6b7280')}
                                size={160}
                            />
                        </div>

                        {/* Insight cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {analytics.languageStats.slice(0, 4).map((l, i) => {
                                const colour = LANG_COLOURS[l.lang] || SERVICE_COLOURS[i];
                                return (
                                    <div key={l.lang} className="bg-gray-900 border border-white/5 rounded-xl p-4 text-center hover:border-white/15 transition-all">
                                        <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-black text-white"
                                            style={{ backgroundColor: colour + '30', border: `2px solid ${colour}50` }}>
                                            {l.lang[0]}
                                        </div>
                                        <p className="text-xl font-black text-white">{l.count}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{l.lang}</p>
                                        <p className="text-xs font-semibold mt-1" style={{ color: colour }}>{l.pct}%</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
          DISTRICTS TAB
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'districts' && (
                <div className="space-y-4">
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Top Districts by Submission Count
                        </p>
                        {analytics.districtStats.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">No district data yet</p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.districtStats.map((d, i) => (
                                    <div key={`${d.district}-${i}`} className="group flex items-center gap-4">
                                        {/* Rank */}
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black text-gray-400 flex-shrink-0">
                                            #{i + 1}
                                        </div>

                                        {/* District info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{d.district}</p>
                                                    {d.state && <span className="text-xs text-gray-600 truncate hidden sm:block">· {d.state}</span>}
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                    <span className="text-xs text-gray-500">{d.pct}%</span>
                                                    <span className="text-sm font-black text-white min-w-[2rem] text-right">{d.count}</span>
                                                </div>
                                            </div>
                                            <Bar pct={d.pct} colour={SERVICE_COLOURS[i % SERVICE_COLOURS.length]} delay={i * 40} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* District heatmap style grid */}
                    {analytics.districtStats.length > 0 && (
                        <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">District Heat Map</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {analytics.districtStats.map((d, i) => {
                                    const intensity = (d.count / (analytics.districtStats[0]?.count || 1));
                                    const colour = SERVICE_COLOURS[i % SERVICE_COLOURS.length];
                                    return (
                                        <div
                                            key={`hm-${d.district}-${i}`}
                                            className="rounded-xl p-3 text-center transition-all hover:scale-105 cursor-default"
                                            style={{
                                                backgroundColor: colour + Math.round(intensity * 40 + 10).toString(16).padStart(2, '0'),
                                                border: `1px solid ${colour}${Math.round(intensity * 60 + 15).toString(16).padStart(2, '0')}`,
                                            }}
                                            title={`${d.district}: ${d.count} submissions`}
                                        >
                                            <p className="text-xs font-bold" style={{ color: colour, opacity: 0.9 + intensity * 0.1 }}>
                                                {d.district.length > 10 ? d.district.slice(0, 10) + '…' : d.district}
                                            </p>
                                            <p className="text-lg font-black text-white mt-0.5">{d.count}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
          TRENDS TAB
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'trends' && (
                <div className="space-y-4">
                    {/* Main trend chart */}
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Submission Volume — Last 14 Days</p>
                                <p className="text-3xl font-black text-white mt-1">
                                    {analytics.dailyTrend.reduce((s, d) => s + d.count, 0)}
                                    <span className="text-sm font-medium text-gray-500 ml-2">total submissions</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Today</p>
                                <p className="text-2xl font-black text-cyan-400">{todayCount}</p>
                            </div>
                        </div>

                        {/* Full-size sparkline */}
                        <div className="h-32 mb-4">
                            <Sparkline data={analytics.dailyTrend} colour="#06b6d4" />
                        </div>

                        {/* Day labels */}
                        <div className="grid text-xs text-gray-600"
                            style={{ gridTemplateColumns: `repeat(${analytics.dailyTrend.length}, 1fr)` }}>
                            {analytics.dailyTrend.map((d, i) => (
                                <div key={i} className="text-center truncate px-0.5"
                                    style={{ opacity: i % 3 === 0 ? 1 : 0 }}>
                                    {d.date}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Day-by-day breakdown with bar chart */}
                    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Breakdown</p>
                        <div className="flex items-end gap-1 h-32">
                            {analytics.dailyTrend.map((d, i) => {
                                const max = Math.max(...analytics.dailyTrend.map(x => x.count), 1);
                                const heightPct = (d.count / max) * 100;
                                const isToday = i === analytics.dailyTrend.length - 1;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {d.date}: {d.count}
                                        </div>
                                        <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                                            <div
                                                className="w-full rounded-t-sm transition-all duration-700 ease-out"
                                                style={{
                                                    height: `${heightPct}%`,
                                                    backgroundColor: isToday ? '#8b5cf6' : '#06b6d4',
                                                    opacity: isToday ? 1 : 0.6,
                                                    minHeight: d.count > 0 ? '4px' : '0',
                                                }}
                                            />
                                        </div>
                                        {i % 3 === 0 && (
                                            <p className="text-[9px] text-gray-600 truncate w-full text-center">{d.date.split(' ')[0]}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Weekly stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                label: 'This Week', value: analytics.dailyTrend.slice(-7).reduce((s, d) => s + d.count, 0),
                                colour: '#06b6d4', icon: '📅'
                            },
                            {
                                label: 'Last Week', value: analytics.dailyTrend.slice(-14, -7).reduce((s, d) => s + d.count, 0),
                                colour: '#8b5cf6', icon: '📆'
                            },
                            {
                                label: 'Daily Avg', value: Math.round(analytics.dailyTrend.reduce((s, d) => s + d.count, 0) / 14),
                                colour: '#10b981', icon: '📊'
                            },
                            {
                                label: 'Peak Day', value: Math.max(...analytics.dailyTrend.map(d => d.count)),
                                colour: '#f59e0b', icon: '🔥'
                            },
                        ].map(item => (
                            <div key={item.label} className="bg-gray-900 border border-white/5 rounded-xl p-4 text-center hover:border-white/15 transition-all">
                                <span className="text-2xl">{item.icon}</span>
                                <p className="text-2xl font-black mt-1" style={{ color: item.colour }}>{item.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

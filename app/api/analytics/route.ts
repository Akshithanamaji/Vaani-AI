import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, reloadDB } from '@/lib/submission-db';

export async function GET(request: NextRequest) {
    try {
        reloadDB();

        const { searchParams } = new URL(request.url);
        const adminState = searchParams.get('state') || '';
        const adminDistrict = searchParams.get('district') || '';
        const serviceId = searchParams.get('serviceId');

        let all = getAllSubmissions(true); // include completed

        // Filter by admin location if provided
        if (adminState) {
            all = all.filter(s => s.userDetails?._state === adminState);
        }
        if (adminDistrict) {
            all = all.filter(s => s.userDetails?._district === adminDistrict);
        }
        if (serviceId) {
            all = all.filter(s => s.serviceId === parseInt(serviceId));
        }

        const total = all.length;

        // ─── 1. Most used service ───────────────────────────────────────────────
        const serviceCount: Record<string, number> = {};
        const serviceIdMap: Record<string, number> = {};
        all.forEach(s => {
            serviceCount[s.serviceName] = (serviceCount[s.serviceName] || 0) + 1;
            serviceIdMap[s.serviceName] = s.serviceId;
        });
        const serviceStats = Object.entries(serviceCount)
            .map(([name, count]) => ({ name, count, id: serviceIdMap[name], pct: total ? Math.round((count / total) * 100) : 0 }))
            .sort((a, b) => b.count - a.count);

        // ─── 2. Language usage via _language field ──────────────────────────────
        const languageCount: Record<string, number> = {};
        all.forEach(s => {
            const lang = s.userDetails?._language || s.userDetails?.language || 'English';
            languageCount[lang] = (languageCount[lang] || 0) + 1;
        });
        const languageStats = Object.entries(languageCount)
            .map(([lang, count]) => ({ lang, count, pct: total ? Math.round((count / total) * 100) : 0 }))
            .sort((a, b) => b.count - a.count);

        // ─── 3. Submissions per district ────────────────────────────────────────
        const districtCount: Record<string, number> = {};
        const districtStateMap: Record<string, string> = {};
        all.forEach(s => {
            const district = s.userDetails?._district || 'Unknown';
            const state = s.userDetails?._state || '';
            districtCount[district] = (districtCount[district] || 0) + 1;
            districtStateMap[district] = state;
        });
        const districtStats = Object.entries(districtCount)
            .map(([district, count]) => ({ district, state: districtStateMap[district], count, pct: total ? Math.round((count / total) * 100) : 0 }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);   // top 15 districts

        // ─── 4. Status breakdown ────────────────────────────────────────────────
        const statusCount: Record<string, number> = {};
        all.forEach(s => {
            statusCount[s.status] = (statusCount[s.status] || 0) + 1;
        });

        // ─── 5. Daily submissions trend (last 14 days) ──────────────────────────
        const dayMap: Record<string, number> = {};
        const now = Date.now();
        for (let i = 13; i >= 0; i--) {
            const d = new Date(now - i * 86400000);
            const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            dayMap[key] = 0;
        }
        all.forEach(s => {
            const d = new Date(s.submittedAt);
            const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            if (key in dayMap) {
                dayMap[key]++;
            }
        });
        const dailyTrend = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

        // ─── 6. Category breakdown ──────────────────────────────────────────────
        // We infer category from service name patterns
        const categoryHints: Record<string, string> = {
            'Aadhaar': 'Identity', 'PAN': 'Taxation', 'Passport': 'Travel',
            'Driving': 'Transportation', 'Vehicle': 'Transportation',
            'Birth': 'Legal', 'Income': 'Finance', 'Caste': 'Social',
            'Scholarship': 'Education', 'Voter': 'Identity', 'Ration': 'Subsidies',
            'Pension': 'Pension', 'Health': 'Health', 'MGNREGA': 'Employment',
        };
        const categoryCount: Record<string, number> = {};
        all.forEach(s => {
            let cat = 'Other';
            for (const [kw, c] of Object.entries(categoryHints)) {
                if (s.serviceName.includes(kw)) { cat = c; break; }
            }
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        const categoryStats = Object.entries(categoryCount)
            .map(([cat, count]) => ({ cat, count, pct: total ? Math.round((count / total) * 100) : 0 }))
            .sort((a, b) => b.count - a.count);

        // ─── 7. Approval rate ───────────────────────────────────────────────────
        const completed = all.filter(s => ['completed', 'ready_for_collection', 'collected'].includes(s.status)).length;
        const rejected = all.filter(s => s.status === 'rejected').length;
        const pending = all.filter(s => ['submitted', 'under_review', 'processing'].includes(s.status)).length;
        const approvalRate = total > 0 ? Math.round(((completed) / total) * 100) : 0;

        return NextResponse.json({
            success: true,
            analytics: {
                total,
                completed,
                rejected,
                pending,
                approvalRate,
                serviceStats,
                languageStats,
                districtStats,
                statusCount,
                dailyTrend,
                categoryStats,
            }
        });
    } catch (error) {
        console.error('[Analytics API] Error:', error);
        return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
    }
}

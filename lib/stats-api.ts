import { supabaseAdmin } from './supabase';

export type DashboardStats = {
    totalUsers: number;
    newUsers24h: number;
    activeUsers24h: number;
    dailyGrowth: { date: string; count: number }[];
    hourlyGrowth: { date: string; count: number }[];
    conversionRate: number;
    retentionRate: number;
    originStats: { ios: number; android: number; other: number };
    languageStats: { fr: number; en: number; other: number };
    countryStats: { [key: string]: number };
    premiumCount: number;
    premiumRate: number;
    inactive7d: number;
    inactive14d: number;
    inactive30d: number;
    logs: any[];
    dailyActiveUsers: { date: string; count: number }[];
    weeklyRetention: {
        week: number;
        percentage: number;
        activeUsers: number;
        eligibleUsers: number;
    }[];
    totalNotes: number;
    totalBucketList: number;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Parallel requests
        const [
            { count: totalUsers },
            { count: newUsers24h },
            { data: activeLogs24h },
            { data: allProfiles }, // Fetch minimal data for calculations
            { count: coupledUsers },
            { count: premiumUsers },
            { data: cleanupLogs },
            { data: allDailySymptoms },
            { count: totalNotes },
            { count: totalBucketList },
        ] = await Promise.all([
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
            supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', last24h.toISOString()),
            supabaseAdmin
                .from('daily_symptoms')
                .select('user_id')
                .gte('created_at', last24h.toISOString()),
            supabaseAdmin
                .from('profiles')
                .select('id, created_at, store_origin, language, country, last_login_at')
                .order('created_at', { ascending: true }),
            supabaseAdmin
                .from('user_partners')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true),
            supabaseAdmin
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('is_premium', true),
            supabaseAdmin
                .from('cleanup_logs' as any)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5),
            supabaseAdmin.from('daily_symptoms').select('user_id, created_at'),
            supabaseAdmin.from('notes').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('bucket_list').select('*', { count: 'exact', head: true }),
        ]);

        const originStats = { ios: 0, android: 0, other: 0 };
        const languageStats = { fr: 0, en: 0, other: 0 };
        const countryStats: { [key: string]: number } = {};

        let inactive7d = 0;
        let inactive14d = 0;
        let inactive30d = 0;

        const date7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const date14d = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const date30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        allProfiles?.forEach((p) => {
            // Origin
            if (p.store_origin === 'ios') originStats.ios++;
            else if (p.store_origin === 'android') originStats.android++;
            else originStats.other++;

            // Language
            if (p.language === 'fr') languageStats.fr++;
            else if (p.language === 'en') languageStats.en++;
            else languageStats.other++;

            // Country
            if (p.country) {
                countryStats[p.country] = (countryStats[p.country] || 0) + 1;
            } else {
                countryStats['Inconnu'] = (countryStats['Inconnu'] || 0) + 1;
            }

            // Inactivity
            const lastActive = p.last_login_at ? new Date(p.last_login_at) : new Date(p.created_at);
            if (lastActive < date7d) inactive7d++;
            if (lastActive < date14d) inactive14d++;
            if (lastActive < date30d) inactive30d++;
        });

        // Active users logic
        const active24hSet = new Set(activeLogs24h?.map((l) => l.user_id));
        const activeUsers24h = active24hSet.size;

        // --- 1. Daily Growth (Full History) ---
        const growthMap = new Map<string, number>();
        allProfiles?.forEach((p) => {
            const date = new Date(p.created_at).toISOString().split('T')[0];
            growthMap.set(date, (growthMap.get(date) || 0) + 1);
        });

        let dailyAcc = 0;
        const dailyGrowth = Array.from(growthMap.entries()).map(([date, count]) => {
            dailyAcc += count;
            return { date, count: dailyAcc };
        });

        // --- 2. Hourly Growth (Last 24h) ---
        // Start count = Total users - New users in last 24h
        let hourlyAcc = (totalUsers || 0) - (newUsers24h || 0);
        const hourlyGrowthMap = new Map<string, number>();

        // Initialize last 24h buckets with 0
        // We use the last 24 hours relative to NOW
        const startOf24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        for (let i = 0; i < 24; i++) {
            const d = new Date(startOf24h.getTime() + i * 60 * 60 * 1000);
            const key = d.getHours().toString().padStart(2, '0') + ':00';
            hourlyGrowthMap.set(key, 0);
        }

        // Fill buckets
        allProfiles?.forEach((p) => {
            const pDate = new Date(p.created_at);
            if (pDate >= startOf24h) {
                const h = pDate.getHours().toString().padStart(2, '0') + ':00';
                // Increment the count for this hour
                hourlyGrowthMap.set(h, (hourlyGrowthMap.get(h) || 0) + 1);
            }
        });

        // Convert map to cumulative array in chronological order
        // Since we iterate hours sequentially from startOf24h, the order is preserved naturally if we rebuild it
        const hourlyGrowth: { date: string; count: number }[] = [];
        for (let i = 0; i < 24; i++) {
            const d = new Date(startOf24h.getTime() + i * 60 * 60 * 1000);
            const key = d.getHours().toString().padStart(2, '0') + ':00';
            const countInHour = hourlyGrowthMap.get(key) || 0;
            hourlyAcc += countInHour;
            hourlyGrowth.push({ date: key, count: hourlyAcc });
        }

        // --- 3. Daily Active Users ---
        const dauMap = new Map<string, Set<string>>();
        allDailySymptoms?.forEach((record: any) => {
            const date = new Date(record.created_at).toISOString().split('T')[0];
            if (!dauMap.has(date)) dauMap.set(date, new Set());
            dauMap.get(date)!.add(record.user_id);
        });
        const dailyActiveUsers = Array.from(dauMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, users]) => ({ date, count: users.size }));

        // --- 4. Weekly Retention ---
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const userSignupDate = new Map<string, Date>();
        allProfiles?.forEach((p: any) => {
            userSignupDate.set(p.id, new Date(p.created_at));
        });

        const userActivityWeeks = new Map<string, Set<number>>();
        allDailySymptoms?.forEach((record: any) => {
            const signup = userSignupDate.get(record.user_id);
            if (signup) {
                const actDate = new Date(record.created_at);
                const weekNum = Math.floor((actDate.getTime() - signup.getTime()) / weekMs);
                if (weekNum >= 0) {
                    if (!userActivityWeeks.has(record.user_id))
                        userActivityWeeks.set(record.user_id, new Set());
                    userActivityWeeks.get(record.user_id)!.add(weekNum);
                }
            }
        });

        const maxRetentionWeeks = 20;
        const weeklyRetention: {
            week: number;
            percentage: number;
            activeUsers: number;
            eligibleUsers: number;
        }[] = [];
        for (let weekIndex = 0; weekIndex < maxRetentionWeeks; weekIndex++) {
            const minSignupAge = (weekIndex + 1) * weekMs;
            const cutoffDate = new Date(now.getTime() - minSignupAge);
            const eligible =
                allProfiles?.filter((p: any) => new Date(p.created_at) <= cutoffDate) || [];

            if (eligible.length === 0) break;

            if (weekIndex === 0) {
                weeklyRetention.push({
                    week: 1,
                    percentage: 100,
                    activeUsers: eligible.length,
                    eligibleUsers: eligible.length,
                });
            } else {
                let activeCount = 0;
                eligible.forEach((p: any) => {
                    const weeks = userActivityWeeks.get(p.id);
                    if (weeks && weeks.has(weekIndex)) activeCount++;
                });
                weeklyRetention.push({
                    week: weekIndex + 1,
                    percentage:
                        eligible.length > 0 ? Math.round((activeCount / eligible.length) * 100) : 0,
                    activeUsers: activeCount,
                    eligibleUsers: eligible.length,
                });
            }
        }

        return {
            totalUsers: totalUsers || 0,
            newUsers24h: newUsers24h || 0,
            activeUsers24h,
            dailyGrowth, // Full history
            hourlyGrowth, // Last 24h detailed
            conversionRate: totalUsers
                ? Math.round((((coupledUsers || 0) * 2) / totalUsers) * 100)
                : 0,
            retentionRate: totalUsers ? Math.round((activeUsers24h / totalUsers) * 100) : 0,
            premiumCount: premiumUsers || 0,
            premiumRate: totalUsers ? Math.round(((premiumUsers || 0) / totalUsers) * 100) : 0,
            originStats,
            languageStats,
            countryStats,
            inactive7d,
            inactive14d,
            inactive30d,
            logs: cleanupLogs || [],
            dailyActiveUsers,
            weeklyRetention,
            totalNotes: totalNotes || 0,
            totalBucketList: totalBucketList || 0,
        };
    } catch (error) {
        console.error('Stats fetch failed:', error);
        return {
            totalUsers: 0,
            newUsers24h: 0,
            activeUsers24h: 0,
            dailyGrowth: [],
            hourlyGrowth: [],
            conversionRate: 0,
            retentionRate: 0,
            premiumCount: 0,
            premiumRate: 0,
            originStats: { ios: 0, android: 0, other: 0 },
            languageStats: { fr: 0, en: 0, other: 0 },
            countryStats: {},
            inactive7d: 0,
            inactive14d: 0,
            inactive30d: 0,
            logs: [],
            dailyActiveUsers: [],
            weeklyRetention: [],
            totalNotes: 0,
            totalBucketList: 0,
        };
    }
};

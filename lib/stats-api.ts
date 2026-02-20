import { supabaseAdmin } from './supabase';

export type DashboardStats = {
  totalUsers: number;
  newUsers24h: number;
  activeUsers24h: number;
  dailyGrowth: { date: string; count: number }[];
  hourlyGrowth: { date: string; count: number }[];
  conversionRate: number;
  retentionRate: number;
  logs: any[];
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
      { data: cleanupLogs }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', last24h.toISOString()),
      supabaseAdmin.from('daily_symptoms').select('user_id').gte('created_at', last24h.toISOString()),
      supabaseAdmin.from('profiles').select('created_at').order('created_at', { ascending: true }),
      supabaseAdmin.from('user_partners').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('cleanup_logs' as any).select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    // Active users logic
    const active24hSet = new Set(activeLogs24h?.map(l => l.user_id));
    const activeUsers24h = active24hSet.size;

    // --- 1. Daily Growth (Full History) ---
    const growthMap = new Map<string, number>();
    allProfiles?.forEach(p => {
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
    allProfiles?.forEach(p => {
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

    return {
      totalUsers: totalUsers || 0,
      newUsers24h: newUsers24h || 0,
      activeUsers24h,
      dailyGrowth, // Full history
      hourlyGrowth, // Last 24h detailed
      conversionRate: totalUsers ? Math.round(((coupledUsers || 0) * 2 / totalUsers) * 100) : 0,
      retentionRate: totalUsers ? Math.round((activeUsers24h / totalUsers) * 100) : 0,
      logs: cleanupLogs || []
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
      logs: []
    };
  }
};

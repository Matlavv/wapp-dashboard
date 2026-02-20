import { ActivityList } from '@/components/ActivityList';
import { DashboardCharts } from '@/components/DashboardCharts';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { getDashboardStats } from '@/lib/stats-api';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-12 overflow-y-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Tableau de Bord</h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Live:{' '}
                            {new Date().toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    </div>
                </header>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Utilisateurs"
                        value={stats.totalUsers.toLocaleString()}
                        change={`+${stats.newUsers24h} (24h)`}
                        type="primary"
                    />
                    <StatCard
                        title="Actifs (24h)"
                        value={stats.activeUsers24h.toLocaleString()}
                        change={`${stats.retentionRate}% rétention`}
                        type="accent"
                    />
                    <StatCard
                        title="Taux Conversion"
                        value={`${stats.conversionRate}%`}
                        change="Couples liés"
                    />
                    <StatCard
                        title="Nouveaux (24h)"
                        value={stats.newUsers24h.toLocaleString()}
                        change="Croissance"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart with Filters */}
                    <div className="lg:col-span-2">
                         <DashboardCharts hourlyGrowth={stats.hourlyGrowth} dailyGrowth={stats.dailyGrowth} />
                    </div>

                    {/* Side Panel: Logs */}
                    <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm h-full flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
                            Derniers Logs
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-2">
                            <ActivityList logs={stats.logs} />
                        </div>
                    </div>
                </div>

                <footer className="mt-20 py-10 opacity-20 text-center">
                    <p className="text-[10px] font-bold tracking-[0.5em] uppercase italic">
                        Wenly Management Interface
                    </p>
                </footer>
            </main>
        </div>
    );
}
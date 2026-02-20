import { GrowthChart } from '@/components/Charts';
import { Sidebar } from '@/components/Sidebar';
import { getDashboardStats } from '@/lib/stats-api';
import { Calendar, Heart, Share2, TrendingUp, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-12 overflow-y-auto">
                <header className="mb-16">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2">Analytique</h1>
                            <p className="text-muted-foreground text-sm font-medium italic">
                                Rapport détaillé sur l&apos;évolution de la communauté Wenly.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-secondary/50 border border-border/50 px-4 py-2 rounded-xl">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                30 Derniers Jours
                            </span>
                        </div>
                    </div>
                </header>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-start mb-10">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Croissance cumulée
                            </h3>
                            <div className="flex items-center gap-2 text-green-500 font-black italic text-lg">
                                <TrendingUp className="w-5 h-5" />
                                <span>+12.4%</span>
                            </div>
                        </div>
                        <div className="h-96 w-full">
                            <GrowthChart data={stats.dailyGrowth} />
                        </div>
                    </div>

                    {/* Quick Stats Panel */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm flex flex-col justify-between h-full">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 text-center">
                                Engagement Global
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                        <span className="text-sm font-bold opacity-60">Actifs</span>
                                    </div>
                                    <span className="text-xl font-black italic">
                                        {stats.activeUsers24h}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Heart className="w-5 h-5 text-muted-foreground" />
                                        <span className="text-sm font-bold opacity-60">
                                            Rétention
                                        </span>
                                    </div>
                                    <span className="text-xl font-black italic">
                                        {stats.retentionRate}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Share2 className="w-5 h-5 text-muted-foreground" />
                                        <span className="text-sm font-bold opacity-60">
                                            Conversion
                                        </span>
                                    </div>
                                    <span className="text-xl font-black italic">
                                        {stats.conversionRate}%
                                    </span>
                                </div>
                            </div>
                            <div className="mt-12 p-6 bg-secondary/30 rounded-2xl border border-border/30 text-center">
                                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Calculé en temps réel depuis l&apos;infrastructure Wenly.
                                </p>
                            </div>
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

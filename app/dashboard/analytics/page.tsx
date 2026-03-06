import { GrowthChart } from '@/components/Charts';
import { RetentionTable } from '@/components/RetentionTable';
import { getDashboardStats } from '@/lib/stats-api';
import {
    Apple,
    Calendar,
    Crown,
    Globe,
    Heart,
    Share2,
    Smartphone,
    TrendingUp,
    Users,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const getCountryName = (code: string) => {
    if (code === 'Inconnu') return 'Inconnu';
    try {
        return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code.toUpperCase()) || code;
    } catch {
        return code;
    }
};

export default async function AnalyticsPage() {
    const stats = await getDashboardStats();

    return (
        <div className="p-6 md:p-12 space-y-8">
            <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                        Analytique
                    </h1>
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
            </header>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-sm">
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
                    <div className="bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-full">
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
                                    <span className="text-sm font-bold opacity-60">Rétention</span>
                                </div>
                                <span className="text-xl font-black italic">
                                    {stats.retentionRate}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Share2 className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm font-bold opacity-60">Conversion</span>
                                </div>
                                <span className="text-xl font-black italic">
                                    {stats.conversionRate}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Crown className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm font-bold opacity-60">Premium</span>
                                </div>
                                <span className="text-xl font-black italic">
                                    {stats.premiumRate}%{' '}
                                    <span className="text-sm font-bold opacity-40">
                                        ({stats.premiumCount})
                                    </span>
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

            {/* Technical Distribution Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-10">
                        Origine (Store)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/20 border border-border/40 p-5 rounded-2xl text-center">
                            <Apple className="w-5 h-5 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 opacity-50">
                                iOS
                            </p>
                            <p className="text-xl font-black italic">{stats.originStats.ios}</p>
                        </div>
                        <div className="bg-secondary/20 border border-border/40 p-5 rounded-2xl text-center">
                            <Smartphone className="w-5 h-5 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 opacity-50">
                                Android
                            </p>
                            <p className="text-xl font-black italic">{stats.originStats.android}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-10">
                        Langues Préférées
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/20 border border-border/40 p-5 rounded-2xl text-center">
                            <Globe className="w-5 h-5 mx-auto mb-3 text-muted-foreground/50" />
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 opacity-50">
                                Français
                            </p>
                            <p className="text-xl font-black italic">{stats.languageStats.fr}</p>
                        </div>
                        <div className="bg-secondary/20 border border-border/40 p-5 rounded-2xl text-center">
                            <Globe className="w-5 h-5 mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 opacity-50">
                                Anglais
                            </p>
                            <p className="text-xl font-black italic">{stats.languageStats.en}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <RetentionTable weeklyRetention={stats.weeklyRetention} />
                </div>

                <div className="md:col-span-2 bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-10">
                        Répartition par Pays
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/30">
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        Pays
                                    </th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                        Utilisateurs
                                    </th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                        Part (%)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {Object.entries(stats.countryStats)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([country, count]) => (
                                        <tr
                                            key={country}
                                            className="group hover:bg-secondary/10 transition-colors"
                                        >
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-5 bg-secondary/50 rounded flex items-center justify-center text-[9px] font-bold text-muted-foreground/70">
                                                        {country === 'Inconnu'
                                                            ? '?'
                                                            : country.substring(0, 3).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-bold opacity-80 capitalize">
                                                        {getCountryName(country)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-sm font-black italic">
                                                    {count}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="hidden sm:block w-24 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-foreground/60 rounded-full"
                                                            style={{
                                                                width: `${stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-muted-foreground min-w-[40px]">
                                                        {stats.totalUsers > 0
                                                            ? Math.round(
                                                                  (count / stats.totalUsers) * 100,
                                                              )
                                                            : 0}
                                                        %
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                {Object.keys(stats.countryStats).length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center py-10 text-xs text-muted-foreground italic"
                                        >
                                            Aucune donnée disponible
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <footer className="mt-20 py-10 opacity-20 text-center">
                <p className="text-[10px] font-bold tracking-[0.5em] uppercase italic">
                    Wenly Management Interface
                </p>
            </footer>
        </div>
    );
}

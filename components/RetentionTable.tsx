import { TrendingDown } from 'lucide-react';

interface RetentionTableProps {
    weeklyRetention: {
        week: number;
        percentage: number;
        activeUsers: number;
        eligibleUsers: number;
    }[];
}

const getRetentionColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    if (percentage >= 20) return 'text-orange-500';
    return 'text-red-500';
};

const getRetentionBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
};

export const RetentionTable = ({ weeklyRetention }: RetentionTableProps) => {
    // Find the biggest weekly drop
    let biggestDrop = { from: 0, to: 0, drop: 0 };
    for (let i = 1; i < weeklyRetention.length; i++) {
        const drop = weeklyRetention[i - 1].percentage - weeklyRetention[i].percentage;
        if (drop > biggestDrop.drop) {
            biggestDrop = { from: weeklyRetention[i - 1].week, to: weeklyRetention[i].week, drop };
        }
    }

    return (
        <div className="md:col-span-2 bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Taux de Rétention par Semaine
                </h3>
                {biggestDrop.drop > 0 && (
                    <div className="flex items-center gap-2 text-orange-500">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs font-bold">
                            Plus gros décrochage : S{biggestDrop.from} → S{biggestDrop.to}{' '}
                            <span className="font-black">(-{biggestDrop.drop}%)</span>
                        </span>
                    </div>
                )}
            </div>

            {weeklyRetention.length === 0 ? (
                <p className="text-center py-10 text-xs text-muted-foreground italic">
                    Pas encore assez de données pour calculer la rétention.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/30">
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Semaine
                                </th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                    Rétention
                                </th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right hidden sm:table-cell">
                                    Actifs
                                </th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right hidden sm:table-cell">
                                    Éligibles
                                </th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                    Évolution
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {weeklyRetention.map((row, index) => {
                                const prevPercentage =
                                    index > 0 ? weeklyRetention[index - 1].percentage : 100;
                                const delta = row.percentage - prevPercentage;

                                return (
                                    <tr
                                        key={row.week}
                                        className="group hover:bg-secondary/10 transition-colors"
                                    >
                                        <td className="py-4 pr-4">
                                            <span className="text-sm font-bold opacity-80">
                                                Semaine {row.week}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="hidden sm:block w-24 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${getRetentionBgColor(row.percentage)}`}
                                                        style={{ width: `${row.percentage}%` }}
                                                    />
                                                </div>
                                                <span
                                                    className={`text-sm font-black italic min-w-[45px] ${getRetentionColor(row.percentage)}`}
                                                >
                                                    {row.percentage}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right hidden sm:table-cell">
                                            <span className="text-sm font-black italic">
                                                {row.activeUsers.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right hidden sm:table-cell">
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {row.eligibleUsers.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {index === 0 ? (
                                                <span className="text-xs font-bold text-muted-foreground/50">
                                                    Base
                                                </span>
                                            ) : (
                                                <span
                                                    className={`text-xs font-black italic ${delta < 0 ? 'text-red-500' : delta > 0 ? 'text-green-500' : 'text-muted-foreground'}`}
                                                >
                                                    {delta > 0 ? '+' : ''}
                                                    {delta}%
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-8 p-4 bg-secondary/20 rounded-2xl border border-border/20">
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest text-center">
                    Semaine 1 = semaine d&apos;inscription (base 100%). Seuls les utilisateurs
                    inscrits depuis assez longtemps sont comptés.
                </p>
            </div>
        </div>
    );
};

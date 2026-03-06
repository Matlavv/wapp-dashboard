'use client';

import { BarChart3, Calendar, Infinity as InfinityIcon, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DAUBarChart } from './Charts';

interface DailyActiveUsersChartProps {
    dailyActiveUsers: { date: string; count: number }[];
}

type TimeRange = '30j' | '6m' | '1an' | 'all';

export const DailyActiveUsersChart = ({ dailyActiveUsers }: DailyActiveUsersChartProps) => {
    const [range, setRange] = useState<TimeRange>('30j');

    const getFilteredData = () => {
        switch (range) {
            case '30j':
                return dailyActiveUsers.slice(-30);
            case '6m':
                return dailyActiveUsers.slice(-180);
            case '1an':
                return dailyActiveUsers.slice(-365);
            case 'all':
                return dailyActiveUsers;
            default:
                return dailyActiveUsers.slice(-30);
        }
    };

    const data = getFilteredData();

    // Compute average DAU for filtered period
    const avgDAU =
        data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.count, 0) / data.length) : 0;

    return (
        <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Utilisateurs Actifs par Jour{' '}
                        {range === '30j'
                            ? '(30j)'
                            : range === '6m'
                              ? '(6 mois)'
                              : range === '1an'
                                ? '(1 an)'
                                : '(Tout)'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold">
                            Moyenne : <span className="text-foreground font-black">{avgDAU}</span> /
                            jour
                        </span>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50">
                    <button
                        onClick={() => setRange('30j')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            range === '30j'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Calendar className="w-3 h-3" />
                        30j
                    </button>
                    <button
                        onClick={() => setRange('6m')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            range === '6m'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <BarChart3 className="w-3 h-3" />
                        6m
                    </button>
                    <button
                        onClick={() => setRange('1an')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            range === '1an'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <BarChart3 className="w-3 h-3" />
                        1an
                    </button>
                    <button
                        onClick={() => setRange('all')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            range === 'all'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <InfinityIcon className="w-3 h-3" />
                        Tout
                    </button>
                </div>
            </div>

            <div className="h-80 w-full">
                <DAUBarChart data={data} />
            </div>
        </div>
    );
};

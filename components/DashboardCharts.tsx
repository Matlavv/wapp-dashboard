'use client';

import { BarChart3, Calendar, Clock, Infinity as InfinityIcon } from 'lucide-react';
import { useState } from 'react';
import { GrowthChart } from './Charts';

interface DashboardChartsProps {
    hourlyGrowth: { date: string; count: number }[];
    dailyGrowth: { date: string; count: number }[];
}

type TimeRange = '24h' | '30j' | '1an' | 'all';

export const DashboardCharts = ({ hourlyGrowth, dailyGrowth }: DashboardChartsProps) => {
    const [range, setRange] = useState<TimeRange>('30j');

    const getFilteredData = () => {
        switch (range) {
            case '24h':
                return hourlyGrowth;
            case '30j':
                return dailyGrowth.slice(-30);
            case '1an':
                return dailyGrowth.slice(-365);
            case 'all':
                return dailyGrowth;
            default:
                return dailyGrowth.slice(-30);
        }
    };

    const data = getFilteredData();

    return (
        <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Évolution{' '}
                        {range === '24h'
                            ? '(24h)'
                            : range === '30j'
                              ? '(30j)'
                              : range === '1an'
                                ? '(1 an)'
                                : '(Tout)'}
                    </h3>
                </div>

                {/* Filter Controls */}
                <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50">
                    <button
                        onClick={() => setRange('24h')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            range === '24h'
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Clock className="w-3 h-3" />
                        24h
                    </button>
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

            <div className="h-87.5 w-full">
                <GrowthChart data={data} />
            </div>
        </div>
    );
};

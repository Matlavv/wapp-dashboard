'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from 'next-themes';

interface GrowthDataPoint {
  date: string;
  count: number;
}

// Interface simplifiée pour les props du Tooltip Recharts
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    let dateLabel = label || '';
    if (dateLabel && !dateLabel.includes(':')) {
       dateLabel = new Date(dateLabel).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    } else {
       dateLabel = `${dateLabel} (24h)`;
    }

    return (
      <div className="bg-card/90 backdrop-blur-md border border-border p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {dateLabel}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-foreground">{payload[0].value}</span>
          <span className="text-xs font-medium text-muted-foreground">utilisateurs</span>
        </div>
      </div>
    );
  }
  return null;
};

export const GrowthChart = ({ data }: { data: GrowthDataPoint[] }) => {
  const { theme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
          </linearGradient>
          {/* Effet de lueur (Glow) pour le mode sombre */}
          <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur" />
             <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
             </feMerge>
          </filter>
        </defs>
        
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="var(--border)" 
          opacity={0.3} 
        />
        
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }}
          tickMargin={15}
          minTickGap={30}
          tickFormatter={(value) => {
            if (value.includes(':')) return value;
            return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
          }}
        />
        
        <YAxis 
          hide={true} 
          domain={['dataMin - 1', 'dataMax + 5']} 
        />
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }} 
        />
        
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="var(--foreground)" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorCount)" 
          animationDuration={1500}
          style={{ filter: theme === 'dark' ? 'url(#glow)' : 'none' }} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
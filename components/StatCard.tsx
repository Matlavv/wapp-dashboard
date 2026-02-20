import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  type?: 'default' | 'primary' | 'accent';
}

export function StatCard({ title, value, change, type = 'default' }: StatCardProps) {
  return (
    <div className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-xl transition-colors ${
          type === 'primary' ? 'bg-foreground text-background' : 
          type === 'accent' ? 'bg-secondary text-foreground' : 
          'bg-secondary/50 text-muted-foreground group-hover:bg-secondary group-hover:text-foreground'
        }`}>
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>
      
      <div>
        <div className="text-3xl font-black tracking-tight text-foreground mb-1">{value}</div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/80">
          <ArrowUpRight className="w-3 h-3 text-green-500" />
          <span className="text-green-600 dark:text-green-400">{change}</span>
        </div>
      </div>
    </div>
  );
}
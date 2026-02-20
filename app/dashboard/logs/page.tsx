import { Sidebar } from '@/components/Sidebar';
import { Activity, Clock, Trash2, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface CleanupLog {
  id: string;
  executed_at: string;
  daily_symptoms_deleted: number;
  daily_moods_deleted: number;
}

export default async function LogsPage() {
  const { data } = await supabaseAdmin
    .from('cleanup_logs')
    .select('*')
    .order('executed_at', { ascending: false })
    .limit(20);

  const logs = data as CleanupLog[] | null;

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-16">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Logs Cleanup</h1>
              <p className="text-muted-foreground text-sm font-medium italic">
                Historique des opérations de nettoyage automatique des données éphémères.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-secondary/50 border border-border/50 px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">En temps réel</span>
            </div>
          </div>
        </header>

        {/* Logs Timeline */}
        <div className="space-y-6">
          {logs?.map((log) => (
            <div key={log.id} className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight mb-1">Nettoyage Automatique</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-0.5 rounded-md border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Success</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[11px] font-bold">
                        {new Date(log.executed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12 text-center">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Symptoms</p>
                   <div className="flex items-center gap-2 justify-center">
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-lg font-black italic">{log.daily_symptoms_deleted}</span>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Moods</p>
                   <div className="flex items-center gap-2 justify-center">
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-lg font-black italic">{log.daily_moods_deleted}</span>
                   </div>
                </div>
                <button className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 py-10 opacity-20 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase italic">Wenly Management Interface</p>
        </footer>
      </main>
    </div>
  );
}
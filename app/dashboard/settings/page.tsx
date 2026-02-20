'use client';

import { Sidebar } from '@/components/Sidebar';
import { Settings, Shield, Bell, User, Database, Globe, ArrowRight, Lock, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe : ' + error.message);
    } else {
      toast.success('Mot de passe mis à jour avec succès.');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-16">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Configuration</h1>
              <p className="text-muted-foreground text-sm font-medium italic">
                Paramétrez votre environnement et votre profil d'administrateur.
              </p>
            </div>
          </div>
        </header>

        {/* Settings Categories */}
        <div className="max-w-4xl space-y-12 mb-12">
          {/* Section: Account */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Profil Admin</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Email</p>
                   <p className="text-lg font-bold tracking-tight">admin@wenly.fr</p>
                </div>
                
                {/* Admin Password Change */}
                <form onSubmit={handleUpdatePassword} className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Key className="w-3 h-3" /> Changer le mot de passe
                   </p>
                   <div className="flex gap-4">
                     <input
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Nouveau mot de passe"
                       className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
                       minLength={6}
                     />
                     <button 
                       type="submit" 
                       disabled={loading || !password}
                       className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all"
                     >
                        {loading ? <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                     </button>
                   </div>
                </form>
             </div>
          </section>

          {/* Section: Platform */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                <Database className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Platforme</h2>
             </div>
             <div className="bg-card border border-border/50 rounded-3xl overflow-hidden divide-y divide-border/30 shadow-sm">
                <div className="p-8 flex items-center justify-between hover:bg-secondary/20 transition-all cursor-pointer">
                   <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                         <Shield className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold tracking-tight">Règles de Sécurité (RLS)</p>
                         <p className="text-[11px] font-medium text-muted-foreground opacity-60">Gérer les politiques d'accès aux tables.</p>
                      </div>
                   </div>
                   <ArrowRight className="w-4 h-4 text-muted-foreground opacity-30" />
                </div>
                <div className="p-8 flex items-center justify-between hover:bg-secondary/20 transition-all cursor-pointer">
                   <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                         <Bell className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold tracking-tight">Alertes de Nettoyage</p>
                         <p className="text-[11px] font-medium text-muted-foreground opacity-60">Recevoir une notification lors d'un échec de cron.</p>
                      </div>
                   </div>
                   <ArrowRight className="w-4 h-4 text-muted-foreground opacity-30" />
                </div>
                <div className="p-8 flex items-center justify-between hover:bg-secondary/20 transition-all cursor-pointer">
                   <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                         <Globe className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold tracking-tight">Localisation Dashboard</p>
                         <p className="text-[11px] font-medium text-muted-foreground opacity-60">Langue actuelle : Français (FR)</p>
                      </div>
                   </div>
                   <ArrowRight className="w-4 h-4 text-muted-foreground opacity-30" />
                </div>
             </div>
          </section>
        </div>

        <footer className="mt-20 py-10 opacity-20 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase italic">Wenly Management Interface</p>
        </footer>
      </main>
    </div>
  );
}
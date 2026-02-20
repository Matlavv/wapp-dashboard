'use client';

import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('auth_uid', authData.user.id)
                .single();

            if (profileError || profile?.role !== 'admin') {
                await supabase.auth.signOut();
                setError('Accès restreint aux administrateurs.');
                setIsLoading(false);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la connexion.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-secondary to-transparent -z-10" />

            <div className="w-full max-w-md bg-card border border-border shadow-(--shadow-hover) rounded-3xl p-10 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative shadow-xl mb-6 hover:scale-105 transition-transform duration-500 bg-black ">
                        <Image src="/logo.png" alt="Wenly Logo" fill className="object-cover p-2" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2">
                        Wenly Admin
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
                        Connexion sécurisée
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-foreground transition-colors">
                            Identifiant
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-12 pr-4 text-foreground focus:bg-card focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all outline-none placeholder:text-muted-foreground/50 font-medium"
                                placeholder="luffy@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 group-focus-within:text-foreground transition-colors">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-12 pr-4 text-foreground focus:bg-card focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all outline-none placeholder:text-muted-foreground/50 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 py-3 rounded-xl animate-shake">
                            <p className="text-destructive text-xs text-center font-bold">
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-foreground text-background font-black py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : (
                            <>
                                SE CONNECTER
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-50">
                        Wenly stats
                    </p>
                </div>
            </div>
        </div>
    );
}

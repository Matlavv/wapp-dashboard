import { supabase } from '@/lib/supabase';
import { ArrowRight, LayoutDashboard, Lock, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden relative">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[150px] pointer-events-none" />

            <header className="px-8 py-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-lg bg-black">
                        <Image src="/logo.png" alt="Wenly Logo" fill className="object-cover p-2" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Wenly Admin</span>
                </div>

                {user ? (
                    <Link
                        href="/dashboard"
                        className="text-sm font-bold hover:opacity-70 transition-opacity"
                    >
                        Accéder au Dashboard
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="text-sm font-bold hover:opacity-70 transition-opacity"
                    >
                        Connexion
                    </Link>
                )}
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
                <div className="mb-8 p-3 bg-secondary/50 border border-border/50 rounded-2xl inline-flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Accès Sécurisé
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                    Wenly
                    <br />
                    Management
                </h1>

                <p className="max-w-md text-lg text-muted-foreground font-medium mb-12 leading-relaxed">
                    Suite d&apos;administration pour la gestion des utilisateurs, l&apos;analyse des
                    cycles et la surveillance de l&apos;infrastructure.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="group flex items-center justify-center gap-3 w-full bg-foreground text-background py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-xl"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            OUVRIR LE DASHBOARD
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="group flex items-center justify-center gap-3 w-full bg-foreground text-background py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-xl"
                        >
                            <Lock className="w-5 h-5" />
                            S&apos;IDENTIFIER
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </main>

            <footer className="py-8 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                © 2026 Wenly Inc • Infrastructure Interne
            </footer>
        </div>
    );
}

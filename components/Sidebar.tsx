'use client';

import { supabase } from '@/lib/supabase';
import {
    Activity,
    BarChart3,
    LayoutDashboard,
    LogOut,
    Moon,
    Settings,
    Sun,
    Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
    { icon: Users, label: 'Utilisateurs', href: '/dashboard/users' },
    { icon: BarChart3, label: 'Analytique', href: '/dashboard/analytics' },
    { icon: Activity, label: 'Logs Cleanup', href: '/dashboard/logs' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Delay to avoid synchronous render warning
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <aside className="w-72 h-screen sticky top-0 bg-card border-r border-border flex flex-col p-6 z-50">
            {/* Modern & Sober Logo */}
            <div className="mb-12 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-lg bg-black dark:shadow-black/50">
                        <Image src="/logo.png" alt="Wenly Logo" fill className="object-cover p-2" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground">
                            Wenly Admin
                        </h2>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                            Management Suite
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                                isActive
                                    ? 'text-foreground bg-secondary shadow-sm border border-border/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                        >
                            <item.icon
                                className={`w-4 h-4 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4 pt-6 border-t border-border">
                {/* Theme Switcher */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                        <span>Mode {theme === 'dark' ? 'Clair' : 'Sombre'}</span>
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

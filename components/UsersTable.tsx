'use client';

import { sendPasswordResetEmail } from '@/app/actions';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpRight,
    Filter,
    Flame,
    Mail,
    Search,
    Shield,
    Star,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface User {
    id: string;
    username: string | null;
    role: string;
    couple_role: string | null;
    created_at: string;
    current_streak: number;
    is_premium: boolean;
    profile_pic_url: string | null;
    email: string | null;
}

export const UsersTable = ({ users }: { users: User[] }) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSendResetEmail = async (user: User) => {
        if (!user.email) {
            toast.error("Cet utilisateur n'a pas d'email associé.");
            return;
        }

        if (!confirm(`Envoyer un email de réinitialisation à ${user.email} ?`)) return;

        setLoadingId(user.id);
        const res = await sendPasswordResetEmail(user.email);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setLoadingId(null);
    };

    const toggleSort = () => {
        setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    };

    const filteredUsers = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.username?.toLowerCase() || '').includes(searchLower) ||
            (user.email?.toLowerCase() || '').includes(searchLower)
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <p className="text-muted-foreground text-sm font-medium">
                    {sortedUsers.length} résultats affichés.
                </p>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <input
                            placeholder="Chercher un membre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-secondary border border-border/50 rounded-xl py-2.5 pl-11 pr-5 outline-none focus:ring-2 focus:ring-foreground/5 transition-all w-64 text-sm font-medium"
                        />
                    </div>
                    <button className="p-2.5 bg-secondary border border-border/50 rounded-xl hover:bg-muted transition-all">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/50 border-bottom border-border/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Utilisateur
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Statut Couple
                            </th>
                            <th
                                className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center cursor-pointer hover:text-foreground transition-colors group select-none"
                                onClick={toggleSort}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>Inscription</span>
                                    {sortOrder === 'desc' ? (
                                        <ArrowDown className="w-3 h-3" />
                                    ) : (
                                        <ArrowUp className="w-3 h-3" />
                                    )}
                                </div>
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                                Streak
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">
                                Premium
                            </th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {sortedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-secondary/20 transition-colors group"
                            >
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold tracking-tight text-foreground">
                                                {user.username || 'Anonyme'}
                                            </span>
                                            {user.role === 'admin' && (
                                                <Shield className="w-3.5 h-3.5 text-blue-500" />
                                            )}
                                        </div>
                                        {user.email && (
                                            <span className="text-[10px] text-muted-foreground font-medium">
                                                {user.email}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-semibold text-muted-foreground capitalize bg-secondary/50 px-3 py-1 rounded-lg border border-border/40">
                                        {user.couple_role || 'non spécifié'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span className="text-[11px] font-bold text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Flame
                                            className={`w-3.5 h-3.5 ${user.current_streak > 0 ? 'text-orange-500' : 'text-muted-foreground/30'}`}
                                        />
                                        <span className="text-sm font-black italic">
                                            {user.current_streak || 0}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {user.is_premium ? (
                                        <div className="inline-flex items-center gap-1.5 bg-foreground text-background px-3 py-1 rounded-full shadow-sm">
                                            <Star className="w-2.5 h-2.5 fill-current" />
                                            <span className="text-[9px] font-black uppercase tracking-tight">
                                                Premium
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-muted-foreground opacity-30 uppercase">
                                            Standard
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleSendResetEmail(user)}
                                        disabled={loadingId === user.id}
                                        className="p-2 rounded-lg hover:bg-secondary border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                        title="Envoyer email de réinitialisation"
                                    >
                                        {loadingId === user.id ? (
                                            <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                                        ) : (
                                            <Mail className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-foreground hover:text-background transition-all opacity-0 group-hover:opacity-100">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-8 py-12 text-center text-muted-foreground italic"
                                >
                                    Aucun utilisateur trouvé pour &quot;{searchTerm}&quot;.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

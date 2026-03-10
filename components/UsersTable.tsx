'use client';

import { sendPasswordResetEmail } from '@/app/actions';
import {
    Apple,
    ArrowDown,
    ArrowUp,
    Filter,
    Flame,
    Globe,
    HeartPulse,
    Mail,
    Search,
    Shield,
    Smile,
    Smartphone,
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
    store_origin: string | null;
    language: string | null;
    country: string | null;
    last_login_at: string | null;
    symptoms_count: number;
    moods_count: number;
}

const getCountryName = (code: string) => {
    try {
        return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code.toUpperCase()) || code;
    } catch {
        return code;
    }
};

export const UsersTable = ({ users }: { users: User[] }) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<'created_at' | 'last_login_at'>('created_at');
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

    const toggleSort = (field: 'created_at' | 'last_login_at') => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.username?.toLowerCase() || '').includes(searchLower) ||
            (user.email?.toLowerCase() || '').includes(searchLower)
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const valA = sortField === 'last_login_at' ? (a.last_login_at || a.created_at) : a.created_at;
        const valB = sortField === 'last_login_at' ? (b.last_login_at || b.created_at) : b.created_at;
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
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

            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-secondary/50 border-bottom border-border/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Utilisateur
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Statut Couple
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                                Store
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                                Langue
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                                Pays
                            </th>
                            <th
                                className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center cursor-pointer hover:text-foreground transition-colors group select-none"
                                onClick={() => toggleSort('last_login_at')}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>Dernière Connexion</span>
                                    {sortField === 'last_login_at' ? (
                                        sortOrder === 'desc' ? (
                                            <ArrowDown className="w-3 h-3" />
                                        ) : (
                                            <ArrowUp className="w-3 h-3" />
                                        )
                                    ) : (
                                        <div className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center cursor-pointer hover:text-foreground transition-colors group select-none"
                                onClick={() => toggleSort('created_at')}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>Inscription</span>
                                    {sortField === 'created_at' ? (
                                        sortOrder === 'desc' ? (
                                            <ArrowDown className="w-3 h-3" />
                                        ) : (
                                            <ArrowUp className="w-3 h-3" />
                                        )
                                    ) : (
                                        <div className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                                    )}
                                </div>
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                                Symptômes
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                                Humeurs
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
                                    {user.store_origin ? (
                                        <div
                                            className="flex items-center justify-center gap-1.5"
                                            title={user.store_origin}
                                        >
                                            {user.store_origin === 'ios' ? (
                                                <Apple className="w-3.5 h-3.5 text-muted-foreground" />
                                            ) : (
                                                <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                                            )}
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/70">
                                                {user.store_origin}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-tight italic">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {user.language ? (
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Globe className="w-3 h-3 text-muted-foreground/50" />
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-widest">
                                                {user.language}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-tight italic">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {user.country ? (
                                        <div className="flex items-center justify-center gap-1.5" title={getCountryName(user.country)}>
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-widest text-ellipsis overflow-hidden whitespace-nowrap max-w-[80px]">
                                                {getCountryName(user.country)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-tight italic">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {user.last_login_at ? (
                                        <span className="text-[11px] font-bold text-muted-foreground">
                                            {new Date(user.last_login_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-tight italic">
                                            -
                                        </span>
                                    )}
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
                                        <HeartPulse className="w-3 h-3 text-muted-foreground/50" />
                                        <span className="text-sm font-black text-muted-foreground/80">
                                            {user.symptoms_count}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Smile className="w-3 h-3 text-muted-foreground/50" />
                                        <span className="text-sm font-black text-muted-foreground/80">
                                            {user.moods_count}
                                        </span>
                                    </div>
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
                                        className="p-2 rounded-lg hover:bg-secondary border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                                        title="Envoyer email de réinitialisation"
                                    >
                                        {loadingId === user.id ? (
                                            <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                                        ) : (
                                            <Mail className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
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

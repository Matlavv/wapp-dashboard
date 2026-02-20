import { Sidebar } from '@/components/Sidebar';
import { Filter, Mail, Search } from 'lucide-react';

// Mock data to demonstrate UI structure (since no messages table exists yet)
const mockMessages = [
    {
        id: 1,
        sender: 'Julie',
        subject: 'Problème de connexion partenaire',
        preview: `Bonjour, mon partenaire n'arrive pas à...`,
        date: '10:30',
        status: 'new',
    },
    {
        id: 2,
        sender: 'Marc',
        subject: 'Suggestion : Mode Nuit',
        preview: `J'adore l'appli ! Serait-il possible d'ajouter...`,
        date: 'Hier',
        status: 'read',
    },
    {
        id: 3,
        sender: 'Sophie',
        subject: 'Erreur synchronisation',
        preview: `Mes données ne s'affichent pas sur le téléphone de...`,
        date: 'Lun',
        status: 'read',
    },
];

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    // Eventually fetch notes or user feedback here
    // const { data: messages } = await supabaseAdmin.from('notes').select('*').limit(10);

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-12 overflow-y-auto relative flex flex-col h-screen">
                <header className="mb-8 shrink-0">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-2">Messages</h1>
                            <p className="text-muted-foreground text-sm font-medium italic">
                                Centre de retour utilisateur et support (Beta).
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                <input
                                    placeholder="Rechercher..."
                                    className="bg-secondary border border-border/50 rounded-xl py-2.5 pl-11 pr-5 outline-none focus:ring-2 focus:ring-foreground/5 transition-all w-64 text-sm font-medium"
                                />
                            </div>
                            <button className="p-2.5 bg-secondary border border-border/50 rounded-xl hover:bg-muted transition-all">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Messages Interface */}
                <div className="flex-1 bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm flex h-full">
                    {/* List Panel */}
                    <div className="w-1/3 border-r border-border/50 flex flex-col bg-secondary/10">
                        <div className="p-4 border-b border-border/50">
                            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                                Boîte de réception
                            </h2>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-2">
                            {mockMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all ${msg.status === 'new' ? 'bg-background shadow-sm border border-border/50' : 'hover:bg-secondary/50 text-muted-foreground'}`}
                                >
                                    <div className="flex justify-between mb-1">
                                        <span
                                            className={`text-sm font-bold ${msg.status === 'new' ? 'text-foreground' : ''}`}
                                        >
                                            {msg.sender}
                                        </span>
                                        <span className="text-[10px] font-medium text-muted-foreground">
                                            {msg.date}
                                        </span>
                                    </div>
                                    <p
                                        className={`text-xs font-semibold mb-1 truncate ${msg.status === 'new' ? 'text-foreground' : ''}`}
                                    >
                                        {msg.subject}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/70 truncate">
                                        {msg.preview}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* View Panel (Empty State for Demo) */}
                    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-background/50">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                            <Mail className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">
                            Sélectionnez un message
                        </h3>
                        <p className="text-sm text-muted-foreground text-center max-w-xs">
                            Choisissez une conversation dans la liste pour afficher les détails et
                            répondre à l&apos;utilisateur.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

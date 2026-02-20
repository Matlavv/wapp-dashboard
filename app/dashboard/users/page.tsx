import { supabaseAdmin } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import { UsersTable } from '@/components/UsersTable';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  // 1. Récupérer les profils (Data métier)
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Récupérer les users Auth (Emails)
  const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000 
  });

  // 3. Fusionner les données
  const usersWithEmail = profiles?.map(profile => {
    const authUser = authUsers.find(u => u.id === profile.auth_uid);
    return {
      ...profile,
      email: authUser?.email || null
    };
  }) || [];

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Utilisateurs</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Gestion de la communauté et des accès.
            </p>
          </div>
        </header>

        {/* Client Component handling Search, Sort and Actions */}
        <UsersTable users={usersWithEmail} />

        <footer className="mt-20 py-10 opacity-20 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase italic">Wenly Management Interface</p>
        </footer>
      </main>
    </div>
  );
}
'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { createClient } from '@/lib/supabase-server';

// Helper to check admin role
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Non authentifié');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('auth_uid', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Accès refusé: Administrateur uniquement');
  }
  return user;
}

export async function sendPasswordResetEmail(email: string) {
  try {
    // On vérifie que celui qui demande l'action est bien admin
    // Sauf si c'est pour soi-même (géré par le client généralement, mais ici on sécurise via admin pour tout le monde)
    await checkAdmin();

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_site_url || 'http://localhost:3000'}/dashboard/settings`,
    });

    if (error) throw error;

    return { success: true, message: `Email de réinitialisation envoyé à ${email}.` };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message || 'Erreur lors de l\'envoi.' };
  }
}

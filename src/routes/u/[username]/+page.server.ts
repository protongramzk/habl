import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { username } = params;

  // 1. Ambil data akun
  const { data: profile, error: profileError } = await supabase
    .from('accounts')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profile) throw error(404, 'User gak ketemu, mungkin lagi sembunyi.');

  // 2. Hitung Followers & Friends (dari tabel relations)
  const { count: followersCount } = await supabase
    .from('relations')
    .select('*', { count: 'exact', head: true })
    .eq('to_account_id', profile.id)
    .eq('type', 'follower')
    .eq('status', 'accepted');

  const { count: friendsCount } = await supabase
    .from('relations')
    .select('*', { count: 'exact', head: true })
    .eq('to_account_id', profile.id)
    .eq('type', 'friend')
    .eq('status', 'accepted');

  // 3. Ambil Posts si user
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false });

  return {
    profile,
    stats: {
      followers: followersCount || 0,
      friends: friendsCount || 0
    },
    posts: posts || []
  };
}

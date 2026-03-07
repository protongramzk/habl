<script>
  import { supabase } from '$lib/supabase';
  import PostCard from '$lib/components/PostCard.svelte';
  
  let posts = [];

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, author:author_id(*)') // Join ke tabel accounts
      .order('created_at', { ascending: false });
    posts = data;
  }

  loadPosts();
</script>

<div class="home">
  <header><h2>Beranda</h2></header>
  {#each posts as post (post.id)}
  <PostCard {post} />
{:else}
  <p>Data kosong atau belum ter-load.</p>
{/each}
</div>

<style>
  .home { max-width: 600px; margin: 0 auto; border-left: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); min-height: 100vh; }
  header { padding: var(--space-md); border-bottom: 1px solid var(--border-subtle); }
</style>

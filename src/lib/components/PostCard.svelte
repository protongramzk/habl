<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  export let post;
  
  // State reaktif untuk counter
  $: reactionCount = post.reaction_count || 0;
  let isLiked = false;

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Cek status like saat load
    const { data } = await supabase
      .from('reactions')
      .select('id')
      .eq('post_id', post.id)
      .eq('account_id', post.author_id) // Asumsi author_id di tabel reactions = account_id
      .maybeSingle();
    
    if (data) isLiked = true;
  });

  async function toggleLike() {
    const previousState = isLiked;
    // Optimistic Update UI
    isLiked = !isLiked;
    reactionCount += isLiked ? 1 : -1;

    try {
      if (isLiked) {
        await supabase.from('reactions').insert([{ post_id: post.id, account_id: post.author_id, reaction_type: 'like' }]);
      } else {
        await supabase.from('reactions').delete().eq('post_id', post.id).eq('account_id', post.author_id);
      }
    } catch (e) {
      isLiked = previousState;
      reactionCount = post.reaction_count;
    }
  }
</script>

<article class="post-card">
  <div class="card-header">
    <img 
      src={post.author?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${post.author?.username}`} 
      alt="avatar" 
      class="avatar-round"
    />
    <div class="user-info">
      <a href="/u/{post.author?.username}" class="name">{post.author?.display_name || post.author?.username}</a>
      <span class="timestamp">{new Date(post.created_at).toLocaleDateString()}</span>
    </div>
  </div>

  <div class="card-content">
    <p>{post.content}</p>
  </div>

  {#if post.media_urls?.length > 0}
    <div class="swiper">
      <div class="swiper-wrapper">
        {#each post.media_urls as url}
          <div class="swiper-slide"><img src={url} alt="post" /></div>
        {/each}
      </div>
      <div class="swiper-pagination"></div>
    </div>
  {/if}

  <div class="card-actions">
    <button class="action-btn" class:active={isLiked} on:click={toggleLike}>
      <span class="material-icons">favorite</span>
      <span>{reactionCount}</span>
    </button>
    
    <a href="/p/{post.id}" class="action-btn">
      <span class="material-icons">chat_bubble_outline</span>
      <span>{post.comment_count || 0}</span>
    </a>

    <button class="action-btn" on:click={() => navigator.clipboard.writeText(window.location.origin + '/p/' + post.id)}>
      <span class="material-icons">share</span>
    </button>
  </div>
</article>



<style>
  .post-card {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    margin-bottom: var(--space-md);
    border: 1px solid var(--border-subtle);
    transition: transform 0.2s;
  }

  .card-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); }
  
  .avatar-round {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--border-subtle);
  }

  .user-info { display: flex; flex-direction: column; }
  .name { font-weight: bold; color: var(--text-primary); text-decoration: none; }
  .timestamp { font-size: 0.8rem; color: var(--text-secondary); }

  .card-actions { display: flex; gap: var(--space-lg); margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid var(--border-subtle); }
  
  .action-btn {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.9rem;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 20px;
    transition: background 0.2s;
  }
  
  .action-btn:hover { background: rgba(255,255,255,0.05); }
  .action-btn.active { color: var(--accent); }
</style>

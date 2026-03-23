<script lang="ts">
  import type { Post } from '$lib/supabase/posts';

  // Svelte 5 menggunakan $props() untuk menangkap data dari parent
  let { post } = $props<{ 
    post: Post & { 
      accounts: { username: string, pp_url: string | null } 
    } 
  }>();
</script>

<div class="post-card">
  <div class="header">
    <img 
      src={post.accounts?.pp_url ?? '/default-avatar.png'} 
      alt={post.accounts?.username} 
      class="avatar"
    />
    <span class="username">@{post.accounts?.username}</span>
  </div>

  <div class="content">
    {#if post.media && post.media.length > 0}
      <div class="media-container">
        {#each post.media as url}
          <img src={url} alt="Post content" loading="lazy" />
        {/each}
      </div>
    {/if}
    
    {#if post.caption}
      <p class="caption">{post.caption}</p>
    {/if}
  </div>

  <div class="footer">
    <small>
      {post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID') : 'Baru saja'}
    </small>
  </div>
</div>

<style>
  .post-card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .header { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin-bottom: 1rem; 
  }
  .avatar { 
    width: 40px; 
    height: 40px; 
    border-radius: 50%; 
    object-fit: cover; 
    background: #f0f0f0;
  }
  .username { 
    font-weight: 600; 
    color: #1a1a1a;
  }
  .media-container {
    display: grid;
    gap: 8px;
    margin-bottom: 0.75rem;
  }
  .media-container img { 
    width: 100%; 
    border-radius: 8px; 
    display: block;
  }
  .caption { 
    margin: 0.5rem 0; 
    line-height: 1.5; 
    color: #444;
    white-space: pre-wrap;
  }
  .footer {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f5f5f5;
    color: #888;
  }
</style>

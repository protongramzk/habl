<script lang="ts">
  import type { Post } from '$lib/supabase/posts';
  
  // Kita terima data post sebagai props
  export let post: Post & { accounts: { username: string, pp_url: string | null } };
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
          <img src={url} alt="Post content" />
        {/each}
      </div>
    {/if}
    <p class="caption">{post.caption ?? ''}</p>
  </div>

  <div class="footer">
    <small>{new Date(post.created_at ?? '').toLocaleDateString()}</small>
  </div>
</div>

<style>
  .post-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: white;
  }
  .header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
  .username { font-weight: bold; }
  .media-container img { width: 100%; border-radius: 4px; margin-top: 0.5rem; }
  .caption { margin-top: 0.5rem; line-height: 1.4; }
</style>

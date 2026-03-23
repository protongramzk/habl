<script lang="ts">
  import type { Post } from '$lib/supabase/posts';
  import Card from '$lib/components/Card.svelte';

  let { post } = $props<{
    post: Post & {
      accounts: { username: string, pp_url: string | null }
    }
  }>();

  const formattedDate = $derived(new Date(post.created_at ?? '').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }));
</script>

<Card class="post-card">
  <div class="header">
    <div class="user-info">
      <img
        src={post.accounts?.pp_url ?? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
        alt={post.accounts?.username}
        class="avatar"
      />
      <div class="meta">
        <a href="/u/{post.accounts?.username}" class="username">@{post.accounts?.username}</a>
        <span class="date">{formattedDate}</span>
      </div>
    </div>
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
</Card>

<style>
  :global(.post-card) {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: var(--border-width) solid var(--border);
    background: var(--bg);
  }

  .meta {
    display: flex;
    flex-direction: column;
  }

  .username {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text);
  }

  .date {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .media-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .media-container img {
    width: 100%;
    border-radius: var(--radius);
    display: block;
    border: var(--border-width) solid var(--border);
  }

  .caption {
    margin: 0;
    line-height: 1.5;
    color: var(--text);
    white-space: pre-wrap;
    font-size: 0.95rem;
  }
</style>

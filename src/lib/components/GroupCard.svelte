<script lang="ts">
  export let group: any;

  // Logic mapping URL berdasarkan level
  const getGroupUrl = (level: number, id: string) => {
    switch(level) {
      case 4: return `/a/${id}`;       // Alliance
      case 3: return `/f/${id}`;       // Federation
      case 2: return `/g/${id}`;       // Group
      case 1: return `/g/sub/${id}`;   // Subgroup
      default: return `/g/${id}`;
    }
  };

  const bannerUrl = group.banner_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${group.slug}`;
</script>

<div class="group-card">
  <div class="cover" style="background-image: url({bannerUrl})"></div>
  
  <div class="group-info">
    <h2>{group.name}</h2>
    <p class="member-count">
      <span class="material-icons" style="font-size: 14px;">person</span>
      {group.member_count} Member
    </p>
    
    <a href={getGroupUrl(group.level, group.id)} class="view-btn">
      Lihat {group.level === 4 ? 'Aliansi' : 'Grup'}
    </a>
  </div>
</div>

<style>
  .group-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .cover {
    height: 100px;
    background-size: cover;
    background-position: center;
    background-color: var(--border-subtle);
  }

  .group-info {
    padding: var(--space-md);
    text-align: center;
  }

  h2 { font-size: 1.1rem; margin: 0 0 var(--space-xs) 0; }
  
  .member-count {
    color: var(--text-secondary);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-bottom: var(--space-md);
  }

  .view-btn {
    display: block;
    background: var(--accent);
    color: white;
    text-decoration: none;
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    font-weight: bold;
    font-size: 0.9rem;
    transition: opacity 0.2s;
  }

  .view-btn:hover { opacity: 0.8; }
</style>

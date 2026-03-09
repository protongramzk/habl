<script>
  export let group; // Data object grup
  
  // Mapping warna badge berdasarkan level (1=Sub, 2=Group, 3=Fed, 4=Alli)
  const colors = { 1: '#5e5e5e', 2: '#1d9bf0', 3: '#8257e5', 4: '#f91880' };
  const labels = { 1: 'Subgroup', 2: 'Group', 3: 'Federation', 4: 'Alliance' };
</script>

<div class="group-card">
  <img src={group.banner_url} alt="Cover" class="banner" />
  <div class="content">
    <div class="badge" style="background: {colors[group.level]}">{labels[group.level]}</div>
    <h3>{group.name}</h3>
    <p>{group.description}</p>
    <a href="/g/{group.slug}" class="join-btn">Lihat Grup</a>
  </div>
</div>

<style>
  .group-card { background: var(--bg-surface); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); }
  .banner { width: 100%; height: 100px; object-fit: cover; }
  .content { padding: var(--space-md); }
  .badge { display: inline-block; padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.7rem; color: white; margin-bottom: var(--space-sm); }
  h3 { margin: 0; color: var(--text-primary); }
  p { color: var(--text-secondary); font-size: 0.9rem; }
  .join-btn { display: block; margin-top: var(--space-md); text-align: center; padding: var(--space-xs); border: 1px solid var(--accent); border-radius: 20px; color: var(--accent); text-decoration: none; }
</style>

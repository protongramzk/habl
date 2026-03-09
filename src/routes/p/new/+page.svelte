<script>
  import PostForm from '$lib/components/PostForm.svelte';
</script>

<div class="new-post-page">
  <header class="page-header">
    <a href="/" class="back-btn" aria-label="Kembali ke Beranda">
      <span class="material-icons">arrow_back</span>
    </a>
    <h2>Buat Postingan</h2>
  </header>

  <main class="form-wrapper">
    <PostForm />
  </main>
</div>

<style>
  .new-post-page {
    max-width: 600px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg-primary);
    border-left: 1px solid var(--border-subtle);
    border-right: 1px solid var(--border-subtle);
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid var(--border-subtle);
    
    /* Efek Sticky & Blur (Glassmorphism tipis) */
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7); /* Sesuaikan dengan warna background gelapmu */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .page-header h2 {
    font-size: 1.25rem;
    margin: 0;
    color: var(--text-primary);
    font-weight: 600;
  }

  .back-btn {
    text-decoration: none;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .back-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .form-wrapper {
    padding: var(--space-md);
  }
</style>

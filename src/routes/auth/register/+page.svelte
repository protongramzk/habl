<script lang="ts">
  import { register, loginWithGitHub } from '$lib/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let loading = false;
  let errorMessage = '';

  async function handleRegister() {
    loading = true;
    errorMessage = '';
    try {
      // Kita cuma daftar ke Supabase Auth
      // Username akan diset di halaman /onboarding nanti
      await register(email, password, 'temporary_username'); 
      goto('/onboarding');
    } catch (e: any) {
      errorMessage = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>Daftar Akun</h1>

    <button class="github-btn" on:click={loginWithGitHub}>
      <span class="material-icons">code</span>
      Masuk dengan GitHub
    </button>

    <div class="divider">atau</div>

    <form on:submit|preventDefault={handleRegister}>
      {#if errorMessage}<p class="error">{errorMessage}</p>{/if}
      
      <div class="field">
        <label>Email</label>
        <input type="email" bind:value={email} required />
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" bind:value={password} required />
      </div>
      <button type="submit" disabled={loading}>Daftar</button>
    </form>

    <p class="footer-text">
      Sudah punya akun? <a href="/auth/login">Masuk</a>
    </p>
  </div>
</div>

<style>
  .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; background: var(--bg-primary); }
  .auth-card { background: var(--bg-surface); padding: var(--space-xl); border-radius: var(--radius-md); width: 100%; max-width: 400px; border: 1px solid var(--border-subtle); }
  
  .github-btn {
    width: 100%;
    padding: var(--space-md);
    background: #333;
    color: white;
    border: none;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    font-weight: bold;
  }

  .divider { text-align: center; margin: var(--space-lg) 0; color: var(--text-secondary); font-size: 0.8rem; }
  
  .field { margin-bottom: var(--space-lg); }
  input { width: 100%; padding: var(--space-md); background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: white; box-sizing: border-box; }
  
  button[type="submit"] { width: 100%; padding: var(--space-md); background: var(--accent); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; }
  
  .error { color: #f4212e; font-size: 0.85rem; }
  .footer-text { text-align: center; margin-top: var(--space-xl); color: var(--text-secondary); }
</style>

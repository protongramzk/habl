<script lang="ts">
  import { loginWithPassword } from '$lib/auth';
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';
  let loading = false;
  let errorMessage = '';

  async function handleLogin() {
    loading = true;
    errorMessage = '';
    try {
      await loginWithPassword(email, password);
      goto('/dashboard'); // Ganti sesuai route tujuanmu
    } catch (e: any) {
      errorMessage = e.message || 'Gagal login, cek email/password.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <form on:submit|preventDefault={handleLogin} class="auth-card">
    <h1>Masuk ke Akun</h1>
    
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}

    <div class="field">
      <label for="email">Email</label>
      <input type="email" bind:value={email} placeholder="email@contoh.com" required />
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input type="password" bind:value={password} placeholder="••••••••" required />
    </div>

    <button type="submit" disabled={loading}>
      {loading ? 'Sabar ya...' : 'Masuk'}
    </button>

    <p class="footer-text">
      Belum punya akun? <a href="/auth/register">Daftar di sini</a>
    </p>
  </form>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background-color: var(--bg-primary);
    font-family: var(--font-main);
  }

  .auth-card {
    background-color: var(--bg-surface);
    padding: var(--space-xl);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    width: 100%;
    max-width: 400px;
  }

  h1 {
    color: var(--text-primary);
    margin-bottom: var(--space-lg);
    font-size: 1.5rem;
  }

  .field {
    margin-bottom: var(--space-lg);
  }

  label {
    display: block;
    color: var(--text-secondary);
    margin-bottom: var(--space-xs);
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: var(--space-md);
    background-color: var(--bg-primary);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: var(--accent);
  }

  button {
    width: 100%;
    padding: var(--space-md);
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 25px; /* Biar agak bulat ala medsos sebelah */
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background-color: var(--accent-hover);
  }

  button:disabled {
    opacity: 0.5;
  }

  .error {
    color: #f4212e;
    font-size: 0.85rem;
    margin-bottom: var(--space-md);
  }

  .footer-text {
    color: var(--text-secondary);
    text-align: center;
    margin-top: var(--space-xl);
    font-size: 0.9rem;
  }

  a {
    color: var(--accent);
    text-decoration: none;
  }
</style>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase/client';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Card from '$lib/components/Card.svelte';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      error = authError.message;
      loading = false;
      return;
    }

    goto('/');
  }
</script>

<div class="login-page">
  <Card class="auth-card">
    <h1>Login</h1>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <form onsubmit={handleLogin}>
      <Input
        label="Email"
        type="email"
        id="login-email"
        bind:value={email}
        required
        placeholder="your@email.com"
      />

      <Input
        label="Password"
        type="password"
        id="login-password"
        bind:value={password}
        required
        placeholder="••••••••"
      />

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>

    <p class="footer">
      Don't have an account? <a href="/register">Register</a>
    </p>
  </Card>
</div>

<style>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 2rem;
  }

  :global(.auth-card) {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
    text-align: center;
    letter-spacing: -0.5px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .error {
    color: #ff5252;
    font-size: 0.9rem;
    background: rgba(255, 82, 82, 0.1);
    padding: 0.75rem;
    border-radius: var(--radius);
    border: 1px solid rgba(255, 82, 82, 0.2);
  }

  .footer {
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
  }

  .footer a {
    color: var(--text);
    text-decoration: underline;
  }
</style>

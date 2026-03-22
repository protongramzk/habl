<svelte:head>
  <title>Login</title>
</svelte:head>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase/client';

  let email = '';
  let password = '';
  let error = '';
  let success = '';

  async function handleLogin() {
    error = '';
    success = '';

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      error = authError.message;
      return;
    }

    // Optionally, fetch user details after login
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      success = 'Login successful! Redirecting...';
      setTimeout(() => goto('/'), 1000);
    }
  }
</script>

<div class="login-container">
  <h1>Login</h1>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if success}
    <p class="success">{success}</p>
  {/if}

  <form on:submit|preventDefault={handleLogin}>
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} required />

    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} required />

    <button type="submit" class="btn">Login</button>
  </form>

  <p>
    Don't have an account? <a href="/register">Register here</a>
  </p>
</div>

<style>
  :global(body) {
    background-color: #121212;
    color: #e0e0e0;
  }

  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #1e1e1e;
  }

  .login-container h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .login-container form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .login-container label {
    font-weight: 500;
  }

  .login-container input {
    padding: 0.75rem;
    border-radius: 4px;
    background-color: #2d2d2d;
    border: 1px solid #333;
    color: #e0e0e0;
  }

  .login-container input:focus {
    outline: none;
    border-color: #0077b6;
  }

  .btn {
    padding: 0.75rem;
    background-color: #e0e0e0;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn:hover {
    background-color: #d0d0d0;
  }

  .error {
    color: #ff5252;
    margin-bottom: 1rem;
  }

  .success {
    color: #4caf50;
    margin-bottom: 1rem;
  }

  a {
    color: #0077b6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
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

    <button type="submit">Login</button>
  </form>
  
  <p>
    Don't have an account? <a href="/register">Register here</a>
  </p>
</div>

<style>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .login-container h1 {
    text-align: center;
  }
  
  .login-container form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .login-container label {
    font-weight: bold;
  }
  
  .login-container input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .login-container button {
    padding: 10px;
    background-color: #0077b6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .login-container button:hover {
    background-color: #023e8a;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
</style>
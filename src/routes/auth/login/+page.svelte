<script>
  import { signIn } from '$lib/auth';

  let email = '';
  let password = '';

  async function handleSignIn() {
    try {
      await signIn(email, password);
      // Handle successful sign-in (e.g., redirect)
    } catch (error) {
      console.error('Sign-in failed:', error);
      // Handle sign-in error
    }
  }
</script>

<div>
  <h1>Login</h1>
  <form on:submit|preventDefault={handleSignIn}>
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" bind:value={email} required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={password} required />
    </div>
    <button type="submit">Sign In</button>
  </form>
</div>
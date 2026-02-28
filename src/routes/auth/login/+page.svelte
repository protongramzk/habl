<script>
	import { signIn } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleSignIn() {
		isLoading = true;
		errorMessage = '';
		try {
			const { data, error } = await signIn(email, password);
			if (error) {
				errorMessage = error.message;
			} else {
				// Handle successful sign-in
				goto('/');
			}
		} catch (error) {
			console.error('Sign-in failed:', error);
			errorMessage = 'An unexpected error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="agn-container" style="max-width: 480px; margin-top: var(--agn-space-8);">
	<div class="agn-card elevated">
		<div class="agn-stack gap-6">
			<div>
				<h1 class="agn-font-2xl" style="font-weight: 700;">Welcome back</h1>
				<p class="is-muted">Sign in to your account to continue</p>
			</div>

			<form on:submit|preventDefault={handleSignIn} class="agn-stack gap-4">
				<div class="agn-input-group">
					<label for="email" class="agn-input-label">Email address</label>
					<input
						type="email"
						id="email"
						class="agn-input {errorMessage ? 'is-error' : ''}"
						placeholder="name@example.com"
						bind:value={email}
						required
						disabled={isLoading}
					/>
				</div>

				<div class="agn-input-group">
					<label for="password" class="agn-input-label">Password</label>
					<input
						type="password"
						id="password"
						class="agn-input {errorMessage ? 'is-error' : ''}"
						placeholder="••••••••"
						bind:value={password}
						required
						disabled={isLoading}
					/>
				</div>

				{#if errorMessage}
					<p class="agn-input-error">{errorMessage}</p>
				{/if}

				<button
					type="submit"
					class="agn-btn full-width {isLoading ? 'is-loading' : ''}"
					data-variant="primary"
					disabled={isLoading}
				>
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
			</form>

			<div class="agn-divider"></div>

			<div class="agn-row center gap-2">
				<span class="is-muted">Don't have an account?</span>
				<a href="/auth/register" class="agn-navbar-link" style="padding: 0;">Create an account</a>
			</div>
		</div>
	</div>
</div>

<script>
	import { signUp } from '$lib/auth';
	import { goto } from '$app/navigation';

	let username = '';
	let email = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handleSignUp() {
		isLoading = true;
		errorMessage = '';
		successMessage = '';
		try {
			const { data, error } = await signUp(email, password, username);
			if (error) {
				errorMessage = error.message;
			} else {
				successMessage = 'Registration successful! Please check your email for verification.';
				// Optionally redirect after a delay
				// setTimeout(() => goto('/auth/login'), 3000);
			}
		} catch (error) {
			console.error('Sign-up failed:', error);
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
				<h1 class="agn-font-2xl" style="font-weight: 700;">Create an account</h1>
				<p class="is-muted">Join habl and connect with virtual places</p>
			</div>

			{#if successMessage}
				<div class="agn-panel" style="border: 1px solid var(--agn-success); color: var(--agn-success);">
					{successMessage}
					<div class="agn-stack gap-2" style="margin-top: var(--agn-space-4);">
						<a href="/auth/login" class="agn-btn full-width" data-variant="primary">Go to Login</a>
					</div>
				</div>
			{:else}
				<form on:submit|preventDefault={handleSignUp} class="agn-stack gap-4">
					<div class="agn-input-group">
						<label for="username" class="agn-input-label">Username</label>
						<input
							type="text"
							id="username"
							class="agn-input {errorMessage ? 'is-error' : ''}"
							placeholder="johndoe"
							bind:value={username}
							required
							disabled={isLoading}
						/>
					</div>

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
						<p class="agn-input-hint">Must be at least 6 characters long</p>
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
						{isLoading ? 'Creating account...' : 'Create account'}
					</button>
				</form>

				<div class="agn-divider"></div>

				<div class="agn-row center gap-2">
					<span class="is-muted">Already have an account?</span>
					<a href="/auth/login" class="agn-navbar-link" style="padding: 0;">Sign in instead</a>
				</div>
			{/if}
		</div>
	</div>
</div>

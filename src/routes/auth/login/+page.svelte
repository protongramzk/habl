<script>
	/** @type {import('./$types').ActionData} */
	let { form } = $props();
</script>

<div class="agn-container" style="max-width: 400px; padding-top: var(--agn-space-8);">
	<div class="agn-card elevated">
		<div class="agn-stack gap-4">
			<h1 class="agn-font-2xl" style="text-align: center;">Welcome Back</h1>
			<p class="agn-text-muted" style="text-align: center;">Login to your Habl account</p>

			<form method="POST" class="agn-stack gap-4">
				<div class="agn-input-group">
					<label for="email" class="agn-input-label">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						class="agn-input"
						placeholder="you@example.com"
						value={form?.email ?? ''}
						required
					/>
				</div>

				<div class="agn-input-group">
					<label for="password" class="agn-input-label">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						class="agn-input"
						placeholder="••••••••"
						required
					/>
				</div>

				{#if form?.error}
					<p class="agn-input-error">{form.error}</p>
				{/if}

				<button type="submit" class="agn-btn full-width" data-variant="primary">
					Login
				</button>
			</form>

			<div class="agn-divider"></div>

			<p class="agn-font-sm" style="text-align: center;">
				Don't have an account?
				<a href="/auth/register" class="agn-breadcrumb-link">Register</a>
			</p>
		</div>
	</div>
</div>

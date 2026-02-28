<script>
    import { enhance } from '$app/forms';
    export let form;
</script>

<div class="agn-container" style="max-width: 400px; margin-top: var(--agn-space-8)">
    <div class="agn-card elevated">
        <div class="agn-section">
            <h2 class="agn-font-xl">Login ke Hableffect</h2>
            <p class="is-muted">Masuk untuk melihat feed terbaru.</p>
        </div>

        <form method="POST" use:enhance class="agn-stack gap-4">
            <div class="agn-input-group">
                <label class="agn-input-label" for="email">Email</label>
                <input 
                    class="agn-input {form?.error ? 'is-error' : ''}" 
                    type="email" 
                    name="email" 
                    placeholder="nama@email.com" 
                    value={form?.email ?? ''}
                    required 
                />
            </div>

            <div class="agn-input-group">
                <label class="agn-input-label" for="password">Password</label>
                <input class="agn-input" type="password" name="password" required />
                {#if form?.error}
                    <span class="agn-input-error">{form.error}</span>
                {/if}
            </div>

            <button type="submit" class="agn-btn full-width" data-variant="primary">
                Masuk
            </button>
        </form>

        <hr class="agn-divider" style="margin: var(--agn-space-4) 0" />

        <div class="agn-row center">
            <span class="is-muted">Belum punya akun?</span>
            <a href="/auth/register" class="agn-navbar-link">Daftar sekarang</a>
        </div>
    </div>
</div>

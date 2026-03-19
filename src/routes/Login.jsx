import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { login } from "../utils/auth";

import { Mail, Lock } from "lucide-solid";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email: email(), password: password() });
      navigate("/"); // redirect ke home
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-black flex items-center justify-center p-4">
      <div class="bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 text-white">
        <h2 class="text-xl font-semibold text-center">Login 🔐</h2>

        <form onSubmit={handleSubmit} class="space-y-4">
          {/* Email */}
          <div class="flex items-center gap-2 border border-zinc-700 rounded-lg px-3 py-2">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              class="bg-transparent flex-1 outline-none text-sm text-white placeholder:text-zinc-500"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div class="flex items-center gap-2 border border-zinc-700 rounded-lg px-3 py-2">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              class="bg-transparent flex-1 outline-none text-sm text-white placeholder:text-zinc-500"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading()}
            class="w-full bg-pink-600 hover:bg-pink-500 py-2 rounded-lg font-semibold text-white"
          >
            {loading() ? "Logging in..." : "Login"}
          </button>

          {error() && <p class="text-red-500 text-sm">{error()}</p>}
        </form>

        <p class="text-sm text-zinc-400 text-center">
          Belum punya akun?{" "}
          <a href="/register" class="text-pink-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

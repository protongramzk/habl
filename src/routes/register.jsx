import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { register } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register({
        email: email(),
        password: password(),
        username: username(),
      });

      // 🚀 langsung redirect ke home / login
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", "max-width": "400px", margin: "0 auto" }}>
      <h2>Register 🚀</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username()}
            onInput={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={{ "margin-top": "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ "margin-top": "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading()}
          style={{ "margin-top": "15px" }}
        >
          {loading() ? "Loading..." : "Register"}
        </button>
      </form>

      {error() && (
        <p style={{ color: "red", "margin-top": "10px" }}>
          {error()}
        </p>
      )}
    </div>
  );
}

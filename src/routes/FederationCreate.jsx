import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Navbar from "../components/Navbar";
import { ArrowLeft, Check, AlertCircle } from "lucide-solid";

export default function FederationCreate() {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name()) return setError("Federation name is required");

    setLoading(true);
    setError("");
    try {
      console.log("Creating federation:", { name: name(), description: description() });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/group-list");
    } catch (err) {
      setError("Failed to create federation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container pb-24">
      <header class="flex items-center gap-4 mt-4 mb-8">
        <button onClick={() => navigate(-1)} class="nav-icon-btn">
          <ArrowLeft size={24} />
        </button>
        <h1 class="text-3xl">New Federation</h1>
      </header>

      <div class="bg-blue-900/20 border border-blue-800 p-4 rounded-xl mb-8 flex items-start gap-3">
        <AlertCircle class="text-blue-400 mt-1" size={20} />
        <div>
          <h3 class="text-blue-400 font-bold mb-1">Coming Soon</h3>
          <p class="text-sm text-blue-100 opacity-80">
            Federations allow multiple groups to unite under a single identity and feed. This feature is currently in early development.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} class="space-y-6">
        <div class="space-y-2">
          <label class="font-bold text-sm block">Federation Name</label>
          <input
            type="text"
            placeholder="Interstellar Alliance"
            class="input-field"
            value={name()}
            onInput={(e) => setName(e.target.value)}
          />
        </div>

        <div class="space-y-2">
          <label class="font-bold text-sm block">Vision & Description</label>
          <textarea
            placeholder="Describe the purpose of this federation..."
            class="input-field min-h-[120px]"
            value={description()}
            onInput={(e) => setDescription(e.target.value)}
          />
        </div>

        {error() && (
          <div class="text-red-500 text-sm font-medium">{error()}</div>
        )}

        <button
          type="submit"
          class="btn btn-primary w-full py-4 text-lg"
          disabled={loading()}
        >
          {loading() ? "Initializing..." : "Create Federation"}
        </button>
      </form>

      <Navbar />
    </div>
  );
}

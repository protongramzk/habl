// src/components/Navbar.jsx
import { useNavigate } from "@solidjs/router";
import { user } from "../utils/auth";
import { Home, PlusSquare, Users, User } from "lucide-solid";

export default function Navbar() {
  const navigate = useNavigate();

  const goAccount = () => {
    if (user()) navigate("/u");
    else navigate("/login");
  };

  // Shadcn Nova style button
  const navButtonClass = "flex flex-col items-center justify-center rounded-md h-9 w-9 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800/50 transition-colors";

  return (
    <nav class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md z-50">
      <div class="relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/90 backdrop-blur-md shadow-lg">
        <div class="flex justify-between items-center px-6 py-3">
          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            class={navButtonClass}
            title="Home"
            aria-label="Home"
          >
            <Home size={20} stroke-width={1.5} />
          </button>

          {/* Create Post Button */}
          <button
            onClick={() => navigate("/create-post")}
            class={navButtonClass}
            title="Create Post"
            aria-label="Create Post"
          >
            <PlusSquare size={20} stroke-width={1.5} />
          </button>

          {/* Groups Button */}
          <button
            onClick={() => navigate("/g")}
            class={navButtonClass}
            title="Groups"
            aria-label="Groups"
          >
            <Users size={20} stroke-width={1.5} />
          </button>

          {/* Account Button */}
          <button
            onClick={goAccount}
            class={navButtonClass}
            title={user() ? "Profile" : "Login"}
            aria-label={user() ? "Profile" : "Login"}
          >
            <User size={20} stroke-width={1.5} />
          </button>
        </div>
      </div>
    </nav>
  );
}

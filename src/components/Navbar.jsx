import { useNavigate, useLocation } from "@solidjs/router";
import { user } from "../utils/auth";
import { Home, PlusSquare, Users, User } from "lucide-solid";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goAccount = () => {
    if (user()) navigate("/u/" + (user().username || user().email));
    else navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav class="navbar-container">
      <button
        onClick={() => navigate("/")}
        class={"nav-icon-btn " + (isActive("/") ? "active" : "")}
        title="Home"
      >
        <Home size={22} stroke-width={isActive("/") ? 2.5 : 1.5} />
      </button>

      <button
        onClick={() => navigate("/create")}
        class={"nav-icon-btn " + (isActive("/create") ? "active" : "")}
        title="Create Post"
      >
        <PlusSquare size={22} stroke-width={isActive("/create") ? 2.5 : 1.5} />
      </button>

      <button
        onClick={() => navigate("/group-list")}
        class={"nav-icon-btn " + (isActive("/group-list") ? "active" : "")}
        title="Groups"
      >
        <Users size={22} stroke-width={isActive("/group-list") ? 2.5 : 1.5} />
      </button>

      <button
        onClick={goAccount}
        class={"nav-icon-btn " + (isActive("/u") || isActive("/login") ? "active" : "")}
        title={user() ? "Profile" : "Login"}
      >
        <User size={22} stroke-width={isActive("/u") || isActive("/login") ? 2.5 : 1.5} />
      </button>
    </nav>
  );
}

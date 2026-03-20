// src/routes/UserProfile.jsx
import { useParams } from "@solidjs/router";
import Profile from "../components/Profile";

export default function UserProfilePage() {
  const params = useParams();

  return (
    <div class="min-h-screen bg-black">
      <Profile username={params.username} />
    </div>
  );
}

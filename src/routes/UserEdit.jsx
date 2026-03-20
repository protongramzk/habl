// src/routes/UserEdit.jsx
import { useNavigate } from "@solidjs/router";
import UserForm from "../components/UserForm";
import { user } from "../utils/auth";

export default function UserEditPage() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen bg-black">
      <UserForm
        onSuccess={() => {
          navigate(`/profile/${user().id}`);
        }}
      />
    </div>
  );
}

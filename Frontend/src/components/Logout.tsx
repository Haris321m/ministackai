"use client";
import { useAuth } from "./ContextAPI";

export default function LogoutButton() {
  const { logout, user } = useAuth();

  if (!user) return null;

  return (
    <button onClick={logout}>
      Logout ({user.id})
    </button>
  );
}

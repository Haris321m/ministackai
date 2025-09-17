"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type User = {
  id: string;
  name: string;
  token: string;
  Role: "admin" | "user";
  image?: string;
  planSubscribed?: boolean;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ✅ safe logger (no red screen)
const safeLog = (msg: string, data?: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(msg, data ?? "");
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          safeLog("Login failed:", res.statusText);
          return;
        }

        const data = await res.json().catch(() => null);
        if (!data?.dbuser || !data?.token) {
          safeLog("Invalid login response");
          return;
        }

        try {
          Cookies.set("token", data.token, { secure: true, sameSite: "Strict" });
          Cookies.set("email", data.dbuser.Email ?? "", { secure: true, sameSite: "Strict" });
          Cookies.set("name", data.dbuser.FirstName ?? "", { secure: true, sameSite: "Strict" });
          Cookies.set("userId", data.dbuser.Id ?? "", { secure: true, sameSite: "Strict" });
          Cookies.set("Role", data.dbuser.Role ?? "user", { secure: true, sameSite: "Strict" });
          Cookies.set("planSubscribed", data.dbuser.planSubscribed ?? "false", {
            secure: true,
            sameSite: "Strict",
          });
        } catch (cookieErr) {
          safeLog("Cookie set error:", cookieErr);
        }

        setUser({
          id: data.dbuser.Id,
          name: data.dbuser.FirstName,
          token: data.token,
          Role: data.dbuser.Role,
          planSubscribed: data.dbuser.planSubscribed === "true",
        });

        try {
          router.push(data.dbuser.Role === "admin" ? "/admin" : "/");
        } catch (navErr) {
          safeLog("Navigation error:", navErr);
        }
      } catch (err) {
        safeLog("Login error:", err);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      const cookieKeys = ["userId", "token", "email", "name", "Role", "planSubscribed"];
      cookieKeys.forEach((key) => {
        try {
          Cookies.remove(key);
        } catch (err) {
          safeLog(`Error removing cookie ${key}:`, err);
        }
      });

      setUser(null);
      try {
        router.push("/Login");
      } catch (err) {
        safeLog("Router push error on logout:", err);
      }
    } catch (err) {
      safeLog("Logout error:", err);
    }
  }, [router]);

  useEffect(() => {
    try {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");

      if (token && userId) {
        setUser({
          id: userId,
          token,
          Role: (Cookies.get("Role") as "admin" | "user") ?? "user",
          name: Cookies.get("name") ?? "",
          planSubscribed: Cookies.get("planSubscribed") === "true",
        });
      }
    } catch (err) {
      safeLog("Error loading user from cookies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

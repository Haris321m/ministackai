"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/ContextAPI";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const safeLog = (msg: string, err?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(msg, err ?? "");
    }
  };

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/", "/login", "/signup", "/checkout"];

    try {
      if (!user && !publicPaths.includes(pathname)) {
        router.replace("/login");
        return;
      }

      if (user && !user.planSubscribed && !publicPaths.includes(pathname)) {
        router.replace("/checkout");
        return;
      }

      if (
        user &&
        user.planSubscribed &&
        ["/login", "/signup", "/checkout"].includes(pathname)
      ) {
        router.replace("/dashboard");
        return;
      }
    } catch (err) {
      safeLog("ProtectedRoute redirect error:", err);
    }
  }, [user, loading, pathname, router]);

  if (loading) return null;

  if (!user && !["/", "/login", "/signup", "/checkout"].includes(pathname)) {
    return null;
  }

  if (user && !user.planSubscribed && !["/", "/login", "/signup", "/checkout"].includes(pathname)) {
    return null;
  }

  if (user && user.planSubscribed && ["/login", "/signup", "/checkout"].includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}

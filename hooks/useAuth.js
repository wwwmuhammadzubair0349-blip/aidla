"use client";
// hooks/useAuth.js
// Client-side auth guard used by UserLayout and AdminLayout.
// Since Supabase JS v2 stores sessions in localStorage (not cookies),
// all auth protection must happen client-side.

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useAuth({ requireAdmin = false } = {}) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

  useEffect(() => {
    let mounted = true;

    // Wipes stale localStorage tokens and sends user to login
    async function clearAndRedirect() {
      try { await supabase.auth.signOut({ scope: "local" }); } catch (_) {}
      if (mounted) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }

    async function checkAuth() {
      try {
        // getSession() reads from localStorage and silently refreshes the token.
        // The "Invalid Refresh Token" error fires here when the token is stale.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          // Stale / revoked token — clear it and re-authenticate
          console.warn("[useAuth] Session error:", error.message);
          await clearAndRedirect();
          return;
        }

        if (!session) {
          await clearAndRedirect();
          return;
        }

        const u = session.user;

        if (requireAdmin && (u.email || "").toLowerCase() !== adminEmail) {
          router.replace("/user");
          return;
        }

        setUser(u);
        setLoading(false);

      } catch (err) {
        console.warn("[useAuth] Unexpected auth error:", err?.message);
        if (mounted) await clearAndRedirect();
      }
    }

    checkAuth();

    // Listen for auth events in this tab and others
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "SIGNED_OUT") {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        // Token rotated successfully — refresh user state
        if (event === "TOKEN_REFRESHED" && session) {
          const u = session.user;
          if (requireAdmin && (u.email || "").toLowerCase() !== adminEmail) {
            router.replace("/user");
            return;
          }
          setUser(u);
          setLoading(false);
          return;
        }

        // Any other event with no session — clear and redirect
        if (!session) {
          await clearAndRedirect();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return { user, loading, logout };
}
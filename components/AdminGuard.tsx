"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

const AUTH_KEY = "basta-manibela:admin-auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session?.email) {
          setAuthorized(true);
          setChecking(false);
          return;
        }
      } catch {
        // invalid JSON — treat as not logged in
      }
    }
    router.push("/admin/login");
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <Shield className="mx-auto h-8 w-8 animate-pulse text-gold" />
          <p className="mt-3 font-body text-sm text-muted">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}

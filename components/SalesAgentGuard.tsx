"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";

const AUTH_KEY = "basta-manibela:agent-auth";

export interface AgentSession {
  email: string;
  name: string;
  role: string;
  loggedInAt: number;
}

export default function SalesAgentGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<AgentSession | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AgentSession;
        if (parsed?.email && parsed?.role === "sales-agent") {
          setSession(parsed);
          setAuthorized(true);
          setChecking(false);
          return;
        }
      } catch {
        // invalid JSON — treat as not logged in
      }
    }
    router.push("/login");
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <UserCheck className="mx-auto h-8 w-8 animate-pulse text-gold" />
          <p className="mt-3 font-body text-sm text-muted">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <>{children}</>
  );
}

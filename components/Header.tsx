"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, UserCheck } from "lucide-react";
import NavLinks from "@/components/NavLinks";

const NAV_ITEMS = [
  { href: "/browse", label: "Browse" },
  { href: "/sell", label: "Sell" },
  { href: "/financing", label: "Financing" },
  { href: "/favorites", label: "Favorites" },
];

const AGENT_AUTH_KEY = "basta-manibela:agent-auth";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [agentSession, setAgentSession] = useState<{ name: string } | null>(
    null
  );

  useEffect(() => {
    const raw = localStorage.getItem(AGENT_AUTH_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session?.email && session?.role === "sales-agent") {
          setAgentSession({ name: session.name || "Agent" });
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Basta Manibela"
            width={44}
            height={44}
            className="rounded-full"
          />
          <span className="font-display text-lg tracking-tightish text-paper">
            Basta <span className="text-gold">Manibela</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <NavLinks />

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center text-silver transition-colors hover:text-gold-bright md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span className="relative flex h-5 w-5">
            <Menu
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                mobileOpen
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                mobileOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </span>
        </button>

        {/* Desktop auth button */}
        {agentSession ? (
          <Link
            href="/agent"
            className="hidden items-center gap-2 rounded-sm border border-gold/60 px-4 py-2 font-body text-sm font-medium text-gold-bright transition-colors hover:bg-gold hover:text-bg md:inline-flex"
          >
            <UserCheck className="h-4 w-4" />
            Agent Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="hidden rounded-sm border border-gold/60 px-4 py-2 font-body text-sm font-medium text-gold-bright transition-colors hover:bg-gold hover:text-bg md:inline-block"
          >
            Log in
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-white/10 bg-surface">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="translate-y-0 rounded-sm px-4 py-3 font-body text-sm text-silver transition-all duration-200 hover:bg-white/5 hover:text-gold-bright"
                style={{
                  transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
                }}
              >
                {label}
              </Link>
            ))}
            <div
              className="my-2 border-t border-white/10 transition-all duration-200"
              style={{ transitionDelay: mobileOpen ? "150ms" : "0ms" }}
            />
            {agentSession ? (
              <Link
                href="/agent"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-sm border border-gold/60 px-4 py-3 text-center font-body text-sm font-medium text-gold-bright transition-all duration-200 hover:bg-gold hover:text-bg"
                style={{ transitionDelay: mobileOpen ? "200ms" : "0ms" }}
              >
                <UserCheck className="h-4 w-4" />
                Agent Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="translate-y-0 rounded-sm border border-gold/60 px-4 py-3 text-center font-body text-sm font-medium text-gold-bright transition-all duration-200 hover:bg-gold hover:text-bg"
                style={{ transitionDelay: mobileOpen ? "200ms" : "0ms" }}
              >
                Log in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

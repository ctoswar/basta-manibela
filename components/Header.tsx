"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          href="/login"
          className="hidden rounded-sm border border-gold/60 px-4 py-2 font-body text-sm font-medium text-gold-bright transition-colors hover:bg-gold hover:text-bg md:inline-block"
        >
          Log in
        </Link>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-surface md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            <Link
              href="/browse"
              onClick={() => setMobileOpen(false)}
              className="rounded-sm px-4 py-3 font-body text-sm text-silver transition-colors hover:bg-white/5 hover:text-gold-bright"
            >
              Browse
            </Link>
            <Link
              href="/financing"
              onClick={() => setMobileOpen(false)}
              className="rounded-sm px-4 py-3 font-body text-sm text-silver transition-colors hover:bg-white/5 hover:text-gold-bright"
            >
              Financing
            </Link>
            <Link
              href="/favorites"
              onClick={() => setMobileOpen(false)}
              className="rounded-sm px-4 py-3 font-body text-sm text-silver transition-colors hover:bg-white/5 hover:text-gold-bright"
            >
              Favorites
            </Link>
            <div className="my-2 border-t border-white/10" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-sm border border-gold/60 px-4 py-3 text-center font-body text-sm font-medium text-gold-bright transition-colors hover:bg-gold hover:text-bg"
            >
              Log in
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

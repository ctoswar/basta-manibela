import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";

export default function Header() {
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

        <NavLinks />

        <Link
          href="/login"
          className="rounded-sm border border-gold/60 px-4 py-2 font-body text-sm font-medium text-gold-bright transition-colors hover:bg-gold hover:text-bg"
        >
          Log in
        </Link>
      </div>
    </header>
  );
}

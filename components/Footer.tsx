import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-surface">
      <div className="hairline-gold" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-paper">
            Basta <span className="text-gold">Manibela</span>
          </p>
          <p className="mt-3 max-w-xs font-body text-sm text-muted">
            Quality vehicles. Trusted service. Satisfied every ride.
          </p>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-silver">Explore</p>
          <ul className="mt-3 space-y-2 font-body text-sm text-muted">
            <li><Link href="/browse" className="hover:text-gold-bright">Browse inventory</Link></li>
            <li><Link href="/financing" className="hover:text-gold-bright">Financing calculator</Link></li>
            <li><Link href="/favorites" className="hover:text-gold-bright">Saved vehicles</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-silver">Talk to us</p>
          <ul className="mt-3 space-y-2 font-body text-sm text-muted">
            <li>Lipa City, Batangas</li>
            <li>
              <a href="https://facebook.com/bastamanibela" target="_blank" rel="noopener noreferrer" className="hover:text-gold-bright">Message on Facebook</a>
            </li>
            <li>
              <a href="https://wa.me/639171234567" target="_blank" rel="noopener noreferrer" className="hover:text-gold-bright">Chat on WhatsApp</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center font-body text-xs text-muted">
        © {new Date().getFullYear()} Basta Manibela. All rights reserved.
      </div>
    </footer>
  );
}

export default function ContactSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-paper">Visit or message us</h2>
          <p className="mt-4 max-w-md font-body text-silver">
            Drop by the lot in Lipa City, Batangas, or reach out first — we&apos;ll
            have the vehicle ready for a test drive.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#"
              className="rounded-sm bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright"
            >
              Message on Facebook
            </a>
            <a
              href="#"
              className="rounded-sm border border-gold/60 px-6 py-3 font-body text-sm font-semibold text-gold-bright transition-colors hover:bg-gold hover:text-bg"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="h-72 overflow-hidden rounded-sm border border-white/10">
          <iframe
            title="Basta Manibela location"
            className="h-full w-full grayscale invert-[0.9]"
            src="https://www.google.com/maps?q=Lipa%20City%2C%20Batangas&output=embed"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

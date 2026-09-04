import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <Image
        src="/images/hero-banner.png"
        alt="Basta Manibela showroom lineup of preowned cars and motorcycles"
        fill
        priority
        className="hero-photo object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16">
        <p className="hero-rise font-body text-sm text-gold-bright" style={{ animationDelay: "0.1s" }}>
          Preowned cars and motorcycles, based in Lipa City
        </p>
        <h1 className="hero-rise mt-3 max-w-2xl font-display text-5xl leading-[1.05] text-paper md:text-6xl" style={{ animationDelay: "0.22s" }}>
          Drive your dream.
          <br />
          Own your journey.
        </h1>
        <p className="hero-rise mt-4 max-w-md font-body text-base text-silver" style={{ animationDelay: "0.36s" }}>
          Every vehicle inspected, every price fair, every deal handled with
          peace of mind — <em className="not-italic text-gold-bright">may peace of mind ka.</em>
        </p>

        <form
          action="/browse"
          className="hero-rise mt-8 flex max-w-xl flex-col gap-3 rounded-sm bg-surface/90 p-3 backdrop-blur sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <input
            type="text"
            name="q"
            placeholder="Search brand or model — e.g. Toyota Fortuner"
            className="flex-1 bg-transparent px-3 py-3 font-body text-sm text-paper placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-sm bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-all hover:bg-gold-bright hover:shadow-[0_0_24px_-4px_rgba(233,197,103,0.6)]"
          >
            Search inventory
          </button>
        </form>

        <div className="hero-rise mt-4 flex gap-6 font-body text-xs text-muted" style={{ animationDelay: "0.62s" }}>
          <Link href="/browse?type=car" className="transition-colors hover:text-gold-bright">Cars</Link>
          <Link href="/browse?type=suv" className="transition-colors hover:text-gold-bright">SUVs</Link>
          <Link href="/browse?type=truck" className="transition-colors hover:text-gold-bright">Trucks</Link>
          <Link href="/browse?type=motorcycle" className="transition-colors hover:text-gold-bright">Motorcycles</Link>
        </div>
      </div>
    </section>
  );
}

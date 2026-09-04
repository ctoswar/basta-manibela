import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import FeaturedGrid from "@/components/FeaturedGrid";
import BrowseByType from "@/components/BrowseByType";
import FinancingTeaser from "@/components/FinancingTeaser";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <TrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <FeaturedGrid />
      </ScrollReveal>
      <ScrollReveal delayMs={80}>
        <BrowseByType />
      </ScrollReveal>
      <ScrollReveal>
        <FinancingTeaser />
      </ScrollReveal>
      <ScrollReveal delayMs={80}>
        <ContactSection />
      </ScrollReveal>
    </>
  );
}

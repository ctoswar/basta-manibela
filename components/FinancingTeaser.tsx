import Link from "next/link";
import FinancingCalculator from "@/components/FinancingCalculator";

export default function FinancingTeaser() {
  return (
    <section className="border-y border-white/10 bg-surface2">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-display text-3xl text-paper">
            Know your monthly payment before you visit
          </h2>
          <p className="mt-4 max-w-md font-body text-silver">
            Adjust your down payment and term to see an estimated monthly
            cost on any vehicle in our inventory. When you&apos;re ready, our
            team can walk you through financing partners and requirements.
          </p>
          <Link
            href="/financing"
            className="mt-6 inline-block rounded-sm bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright"
          >
            Open full calculator
          </Link>
        </div>

        <FinancingCalculator compact />
      </div>
    </section>
  );
}

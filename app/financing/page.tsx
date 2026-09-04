import type { Metadata } from "next";
import FinancingCalculator from "@/components/FinancingCalculator";

export const metadata: Metadata = {
  title: "Car loan calculator",
  description:
    "Estimate your monthly car or motorcycle loan payment based on price, down payment, interest rate, and term.",
};

export default function FinancingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl text-paper">Financing calculator</h1>
      <p className="mt-3 max-w-lg font-body text-silver">
        Estimate your monthly payment based on vehicle price, down payment,
        interest rate, and loan term.
      </p>

      <div className="mt-10">
        <FinancingCalculator />
      </div>
    </div>
  );
}

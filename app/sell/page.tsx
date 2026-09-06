import type { Metadata } from "next";
import SellCarForm from "@/components/SellCarForm";

export const metadata: Metadata = {
  title: "Sell your car",
  description:
    "Sell your car, motorcycle, SUV, or truck to Basta Manibela. Get a fair offer from our team.",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl text-paper">Sell your car to us</h1>
      <p className="mt-3 max-w-lg font-body text-silver">
        Got a vehicle you want to sell? Fill out the details below and our team
        will review it and get back to you with an offer.
      </p>

      <div className="mt-10">
        <SellCarForm />
      </div>
    </div>
  );
}

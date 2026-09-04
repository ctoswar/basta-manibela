import Link from "next/link";
import { Car, Bike, CarFront, Truck } from "lucide-react";
import type { VehicleType } from "@/lib/types";

const TYPES: { type: VehicleType; label: string; icon: typeof Car }[] = [
  { type: "car", label: "Sedans", icon: Car },
  { type: "suv", label: "SUVs", icon: CarFront },
  { type: "truck", label: "Trucks", icon: Truck },
  { type: "motorcycle", label: "Motorcycles", icon: Bike },
];

export default function BrowseByType() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-10 font-display text-3xl text-paper">Browse by type</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {TYPES.map(({ type, label, icon: Icon }) => (
          <Link
            key={type}
            href={`/browse?type=${type}`}
            className="group flex flex-col items-center gap-4 rounded-sm py-8 transition-colors hover:bg-surface"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/50 transition-colors group-hover:border-gold">
              <Icon className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </span>
            <span className="font-body text-sm text-silver">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

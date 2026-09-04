import { getListings } from "@/lib/api/listings";
import VehicleCard from "@/components/VehicleCard";
import type { VehicleType } from "@/lib/types";
import Link from "next/link";

const TYPE_FILTERS: { value: VehicleType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "car", label: "Sedans" },
  { value: "suv", label: "SUVs" },
  { value: "truck", label: "Trucks" },
  { value: "motorcycle", label: "Motorcycles" },
];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { type?: string; q?: string };
}) {
  const activeType = (searchParams.type as VehicleType | undefined) ?? undefined;
  const listings = await getListings({
    type: activeType,
    query: searchParams.q,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-paper">Browse inventory</h1>
      <p className="mt-2 font-body text-silver">
        {listings.length} vehicle{listings.length === 1 ? "" : "s"} available
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {TYPE_FILTERS.map(({ value, label }) => {
          const isActive =
            value === "all" ? !activeType : activeType === value;
          const href = value === "all" ? "/browse" : `/browse?type=${value}`;
          return (
            <Link
              key={value}
              href={href}
              className={`rounded-sm border px-4 py-2 font-body text-sm transition-colors ${
                isActive
                  ? "border-gold bg-gold text-bg"
                  : "border-white/15 text-silver hover:border-gold/60"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="mt-16 rounded-sm border border-white/10 bg-surface p-10 text-center">
          <p className="font-body text-silver">
            No vehicles match that filter right now. Try another category or
            check back soon — inventory updates often.
          </p>
        </div>
      )}
    </div>
  );
}

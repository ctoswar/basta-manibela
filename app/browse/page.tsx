import { getListings } from "@/lib/api/listings";
import VehicleCard from "@/components/VehicleCard";
import type { VehicleType } from "@/lib/types";
import Link from "next/link";
import type { Metadata } from "next";

// Revalidate every 60s: inventory changes occasionally, not every request.
// Once a real backend/DB exists, this means Next can serve a cached copy
// instead of hitting the database on every single page view.
export const revalidate = 60;

const TYPE_LABELS: Record<string, string> = {
  car: "Sedans",
  suv: "SUVs",
  truck: "Trucks",
  motorcycle: "Motorcycles",
};

export function generateMetadata({
  searchParams,
}: {
  searchParams: { type?: string };
}): Metadata {
  const label = searchParams.type ? TYPE_LABELS[searchParams.type] : undefined;
  return {
    title: label ? `${label} for sale` : "Browse inventory",
    description: label
      ? `Inspected, ready-to-drive ${label.toLowerCase()} for sale at Basta Manibela, Lipa City.`
      : "Browse inspected, ready-to-drive used cars and motorcycles for sale at Basta Manibela, Lipa City.",
  };
}

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
      <p key={`count-${activeType ?? "all"}-${searchParams.q ?? ""}`} className="rise-in mt-2 font-body text-silver">
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
              className={`rounded-sm border px-4 py-2 font-body text-sm transition-all duration-200 active:scale-95 ${
                isActive
                  ? "border-gold bg-gold text-bg"
                  : "border-white/15 text-silver hover:border-gold/60 hover:text-gold-bright"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div
        key={`${activeType ?? "all"}-${searchParams.q ?? ""}`}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {listings.map((vehicle, i) => (
          <div
            key={vehicle.id}
            className="rise-in"
            style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
          >
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div
          key={`empty-${activeType ?? "all"}`}
          className="rise-in mt-16 rounded-sm border border-white/10 bg-surface p-10 text-center"
        >
          <p className="font-body text-silver">
            No vehicles match that filter right now. Try another category or
            check back soon — inventory updates often.
          </p>
        </div>
      )}
    </div>
  );
}

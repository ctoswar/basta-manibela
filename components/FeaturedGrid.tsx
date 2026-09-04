import { getFeaturedListings } from "@/lib/api/listings";
import VehicleCard from "@/components/VehicleCard";
import Link from "next/link";

export default async function FeaturedGrid() {
  const featured = await getFeaturedListings();
  const [primary, ...rest] = featured;

  if (!primary) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-3xl text-paper">Just arrived</h2>
        <Link href="/browse" className="font-body text-sm text-gold-bright hover:text-gold">
          View all inventory
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <VehicleCard vehicle={primary} size="large" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          {rest.slice(0, 2).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}

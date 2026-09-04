import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/types";
import { formatPHP, formatKm } from "@/lib/format";
import FavoriteButton from "@/components/FavoriteButton";

export default function VehicleCard({
  vehicle,
  size = "default",
}: {
  vehicle: Vehicle;
  size?: "default" | "large";
}) {
  const imageHeight = size === "large" ? "h-72" : "h-48";

  return (
    <div className="group relative overflow-hidden rounded-sm bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(201,162,39,0.35)]">
      <Link href={`/listing/${vehicle.id}`} className="block">
        <div className={`relative ${imageHeight} w-full overflow-hidden`}>
          <Image
            src={vehicle.images[0]}
            alt={vehicle.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {vehicle.status !== "available" && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/60">
              <span className="rounded-sm border border-gold/60 px-3 py-1 font-body text-xs uppercase tracking-wider text-gold-bright">
                {vehicle.status}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="font-display text-lg leading-tight text-paper">
            {vehicle.title}
          </p>
          <p className="mt-1 font-body text-lg font-semibold text-gold-bright">
            {formatPHP(vehicle.price)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-muted">
            <span>{vehicle.year}</span>
            <span className="h-3 w-px bg-gold/40" aria-hidden />
            <span>{formatKm(vehicle.mileageKm)}</span>
            <span className="h-3 w-px bg-gold/40" aria-hidden />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
        </div>
      </Link>
      <FavoriteButton vehicleId={vehicle.id} />
    </div>
  );
}

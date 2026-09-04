import { notFound } from "next/navigation";
import Image from "next/image";
import { getListingById } from "@/lib/api/listings";
import { formatPHP, formatKm } from "@/lib/format";
import FavoriteButton from "@/components/FavoriteButton";
import FinancingCalculator from "@/components/FinancingCalculator";
import ReservationForm from "@/components/ReservationForm";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const vehicle = await getListingById(params.id);
  if (!vehicle) return { title: "Vehicle not found" };

  const description = `${vehicle.year} ${vehicle.brand} ${vehicle.model} — ${formatPHP(
    vehicle.price
  )}. ${formatKm(vehicle.mileageKm)}, ${vehicle.transmission}, ${vehicle.location}.`;

  return {
    title: vehicle.title,
    description,
    openGraph: {
      title: vehicle.title,
      description,
      images: [vehicle.images[0]],
      type: "website",
    },
  };
}

const SPEC_ROWS = (vehicle: NonNullable<Awaited<ReturnType<typeof getListingById>>>) => [
  { label: "Year", value: vehicle.year },
  { label: "Mileage", value: formatKm(vehicle.mileageKm) },
  { label: "Transmission", value: vehicle.transmission },
  { label: "Fuel type", value: vehicle.fuelType },
  { label: "Color", value: vehicle.color },
  { label: "Location", value: vehicle.location },
];

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const vehicle = await getListingById(params.id);
  if (!vehicle) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileageKm,
      unitCode: "KMT",
    },
    color: vehicle.color,
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    offers: {
      "@type": "Offer",
      priceCurrency: "PHP",
      price: vehicle.price,
      availability:
        vehicle.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      areaServed: vehicle.location,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative h-96 overflow-hidden rounded-sm">
          <Image
            src={vehicle.images[0]}
            alt={vehicle.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <FavoriteButton vehicleId={vehicle.id} />
        </div>

        <div>
          <p className="flex items-center gap-2 font-body text-sm capitalize text-gold-bright">
            <span>{vehicle.type}</span>
            <span className="h-3 w-px bg-gold/40" aria-hidden />
            <span>{vehicle.status}</span>
          </p>
          <h1 className="mt-2 font-display text-4xl text-paper">{vehicle.title}</h1>
          <p className="mt-3 font-display text-3xl text-gold-bright">
            {formatPHP(vehicle.price)}
          </p>
          <p className="mt-4 font-body text-silver">{vehicle.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            {SPEC_ROWS(vehicle).map(({ label, value }) => (
              <div key={label}>
                <dt className="font-body text-xs text-muted">{label}</dt>
                <dd className="mt-1 font-body capitalize text-paper">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <ReservationForm vehicleId={vehicle.id} />
        <div>
          <h3 className="mb-4 font-display text-xl text-paper">Estimate financing</h3>
          <FinancingCalculator initialPrice={vehicle.price} compact />
        </div>
      </div>
    </div>
  );
}

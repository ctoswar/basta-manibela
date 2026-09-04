"use client";

import { useEffect, useState } from "react";
import { getListings } from "@/lib/api/listings";
import type { Vehicle } from "@/lib/types";
import { useFavorites } from "@/lib/useFavorites";
import VehicleCard from "@/components/VehicleCard";
import Link from "next/link";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    getListings().then(setVehicles);
  }, []);

  const favorites = vehicles?.filter((v) => favoriteIds.includes(v.id)) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-paper">Saved vehicles</h1>

      {vehicles === null && (
        <p className="mt-6 font-body text-muted">Loading your saved vehicles...</p>
      )}

      {vehicles !== null && favorites.length === 0 && (
        <div className="mt-10 rounded-sm border border-white/10 bg-surface p-10 text-center">
          <p className="font-body text-silver">
            You haven&apos;t saved anything yet. Tap the heart on any listing
            to keep track of it here.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-block font-body text-sm text-gold-bright hover:text-gold"
          >
            Browse inventory
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <p className="mt-10 font-body text-xs text-muted">
        Saved vehicles are currently kept on this device only. Once accounts
        are enabled, they&apos;ll sync to your profile automatically.
      </p>
    </div>
  );
}

"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/useFavorites";

export default function FavoriteButton({ vehicleId }: { vehicleId: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(vehicleId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(vehicleId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bg/70 backdrop-blur transition-colors hover:bg-bg"
    >
      <Heart
        className={active ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-paper"}
        strokeWidth={1.75}
      />
    </button>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "basta-manibela:favorites";

function readStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readStoredIds());
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (vehicleId: string) => {
      const next = ids.includes(vehicleId)
        ? ids.filter((id) => id !== vehicleId)
        : [...ids, vehicleId];
      persist(next);
    },
    [ids, persist]
  );

  const isFavorite = useCallback((vehicleId: string) => ids.includes(vehicleId), [ids]);

  return { favoriteIds: ids, toggle, isFavorite };
}

// NOTE: once user accounts exist, replace the localStorage read/write above
// with GET/POST calls to /api/favorites?userId=... — the toggle()/isFavorite()
// call signature used by components can stay identical.

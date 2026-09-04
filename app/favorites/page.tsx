import type { Metadata } from "next";
import FavoritesClient from "@/components/FavoritesClient";

export const metadata: Metadata = {
  title: "Saved vehicles",
  robots: { index: false, follow: false },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}

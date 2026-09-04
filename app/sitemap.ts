import type { MetadataRoute } from "next";
import { getListings } from "@/lib/api/listings";

const BASE_URL = "https://bastamanibela.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getListings();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/browse`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/financing`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const listingRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${BASE_URL}/listing/${vehicle.id}`,
    lastModified: vehicle.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...listingRoutes];
}

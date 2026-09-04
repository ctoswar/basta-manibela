import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/favorites", "/login"],
    },
    sitemap: "https://bastamanibela.com/sitemap.xml",
  };
}

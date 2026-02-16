import { MetadataRoute } from "next";
import giftcards from "../data/giftcards.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://giftcards.ding.com";

  // Home page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Card pages
  for (const card of giftcards) {
    routes.push({
      url: `${baseUrl}/${card.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Country pages
  const countries = new Set<string>();
  for (const card of giftcards) {
    for (const c of card.countriesAvailableForUse || []) {
      countries.add(c.name.toLowerCase().replace(/\s+/g, "-"));
    }
  }
  for (const country of countries) {
    routes.push({
      url: `${baseUrl}/country/${country}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}

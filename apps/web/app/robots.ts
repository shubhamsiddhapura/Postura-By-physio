import type { MetadataRoute } from "next";

const SITE_URL = "https://www.posturabyphysio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Admin/API/internal routes should not be indexed.
          "/api/",
          "/admin/",
          "/private/",
          // Explicitly noindex page also excluded here.
          "/share-your-story",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}


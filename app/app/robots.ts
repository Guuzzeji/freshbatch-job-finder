import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://freshbatch.tech";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

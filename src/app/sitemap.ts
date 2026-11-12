import { MetadataRoute } from "next";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolify.local";

  const staticRoutes = [
    "",
    "/tools",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies",
    "/disclaimer",
    "/fiverr-message-checker",
    "/fiverr-deliverable-formatter",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route === "/tools" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : 0.7,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolRoutes = TOOLS.filter((t) => t.status === "active").map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}

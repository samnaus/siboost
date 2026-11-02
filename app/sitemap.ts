import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/env"

const paths = [
  "/",
  "/packages",
  "/ai-search-readiness",
  "/how-it-works",
  "/about",
  "/contact",
  "/check",
  "/privacy",
  "/terms",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return paths.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))
}

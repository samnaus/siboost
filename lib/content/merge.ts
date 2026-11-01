import type { SiteContent } from "@/lib/content/types"

export function mergeSiteContent(base: SiteContent, patch: unknown): SiteContent {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return base
  return deepMerge(base, patch) as SiteContent
}

function deepMerge(base: unknown, patch: unknown): unknown {
  if (Array.isArray(patch)) return patch
  if (
    patch &&
    typeof patch === "object" &&
    base &&
    typeof base === "object" &&
    !Array.isArray(base)
  ) {
    const output: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
      if (value === undefined) continue
      output[key] = key in output ? deepMerge(output[key], value) : value
    }
    return output
  }
  return patch
}

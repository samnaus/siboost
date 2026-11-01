import { cacheLife, cacheTag } from "next/cache"
import { defaultSiteContent } from "@/lib/content/defaults"
import { mergeSiteContent } from "@/lib/content/merge"
import type { SiteContent } from "@/lib/content/types"
import { contactEmail } from "@/lib/env"
import { prisma } from "@/lib/db"

export async function getSiteContent(): Promise<SiteContent> {
  "use cache"
  cacheTag("site-content")
  cacheLife("hours")
  const base = withContactEmail(defaultSiteContent)
  try {
    const row = await prisma.contentEntry.findUnique({ where: { key: "site" } })
    if (!row) return base
    return mergeSiteContent(base, JSON.parse(row.value) as unknown)
  } catch (error) {
    console.error("[content] Using the default copy", error)
    return base
  }
}

export async function getContentPatch() {
  const row = await prisma.contentEntry.findUnique({ where: { key: "site" } })
  if (!row) return {}
  return JSON.parse(row.value) as unknown
}

function withContactEmail(content: SiteContent): SiteContent {
  return {
    ...content,
    business: { ...content.business, email: contactEmail() },
  }
}

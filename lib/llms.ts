import type { PublicProduct } from "@/lib/catalog"
import type { SiteContent } from "@/lib/content/types"
import { formatNzdCompact } from "@/lib/money"
import { siteUrl } from "@/lib/env"

export function renderLlmsTxt(content: SiteContent, products: PublicProduct[]) {
  const packages = products.filter((product) => product.kind === "package")
  const subscriptions = products.filter((product) => product.kind === "subscription")
  const lines = [
    `# ${content.business.name}`,
    "",
    `> ${content.business.tagline}`,
    "",
    "This file is a plain-language summary for automated systems. It does not replace a crawlable website, quality pages, structured data, or ordinary search optimisation.",
    "",
    `${content.business.name} is a New Zealand business that upgrades existing websites so people and AI assistants can understand them more easily, and can set up a branded website assistant. It does not guarantee rankings, recommendations, mentions or enquiries.`,
    "",
    "## Packages (NZD, excluding GST)",
    ...packages.map(
      (product) =>
        `- ${product.name}: ${formatNzdCompact(product.priceExGstCents)} one-off. ${product.summary}`,
    ),
    "",
    "## Subscriptions (NZD, excluding GST)",
    ...subscriptions.map(
      (product) =>
        `- ${product.name}: ${formatNzdCompact(product.priceExGstCents)} per month. ${product.summary}`,
    ),
    "",
    "## Pages",
    `- Home: ${siteUrl()}/`,
    `- Packages: ${siteUrl()}/packages`,
    `- AI sales agents: ${siteUrl()}/ai-sales-agents`,
    `- AI search readiness: ${siteUrl()}/ai-search-readiness`,
    `- How it works: ${siteUrl()}/how-it-works`,
    `- About: ${siteUrl()}/about`,
    `- Contact: ${siteUrl()}/contact`,
    "",
    `Contact: ${content.business.email}`,
    "",
  ]
  return lines.join("\n")
}

import type { PublicProduct } from "@/lib/catalog"
import type { SiteContent } from "@/lib/content/types"
import { subscriptionsEnabled, siteUrl } from "@/lib/env"
import { formatNzdCompact } from "@/lib/money"

export function renderLlmsTxt(content: SiteContent, products: PublicProduct[]) {
  const packages = products.filter((product) => product.kind === "package" && product.active)
  const subscriptions = subscriptionsEnabled()
    ? products.filter((product) => product.kind === "subscription" && product.active)
    : []
  const lines = [
    `# ${content.business.name}`,
    "",
    `> ${content.business.tagline}`,
    "",
    "This file is a plain-language summary for automated systems. It does not replace a crawlable website, quality pages, structured data, or ordinary search optimisation.",
    "",
    `${content.business.name} is a New Zealand business that upgrades existing websites so people and AI search tools can understand them more easily.`,
    "",
    "## Packages (NZD, excluding GST)",
    ...packages.map(
      (product) =>
        `- ${product.name}: ${formatNzdCompact(product.priceExGstCents)} one-off. ${product.summary}`,
    ),
    ...(subscriptions.length
      ? [
          "",
          "## Subscriptions (NZD, excluding GST)",
          ...subscriptions.map(
            (product) =>
              `- ${product.name}: ${formatNzdCompact(product.priceExGstCents)} per month. ${product.summary}`,
          ),
        ]
      : []),
    "",
    "## Pages",
    `- Home: ${siteUrl()}/`,
    `- Packages: ${siteUrl()}/packages`,
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

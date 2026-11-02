export type PublicProduct = {
  key: string
  name: string
  summary: string
  audience: string
  priceExGstCents: number
  interval: "month" | null
  badge: string | null
  cta: string
  features: string[]
  footnote: string | null
  active: boolean
  sortOrder: number
  kind: "package" | "subscription"
}

export type ProductRecord = Omit<PublicProduct, "features" | "interval" | "kind"> & {
  features: string
  interval: string | null
  kind: string
}

export const defaultCatalog: PublicProduct[] = [
  {
    key: "si-ready",
    name: "SI Ready",
    summary: "For businesses that want their existing website prepared for AI-driven search.",
    audience: "A focused readiness project for the site you already have.",
    priceExGstCents: 199_900,
    interval: null,
    badge: null,
    cta: "Get SI Ready",
    features: [
      "Full AI-readiness website audit",
      "Technical SEO and crawlability review",
      "Basic structured data implementation",
      "Optimisation of up to 5 existing pages",
      "Review of important business information",
      "Basic AI search visibility assessment",
      "llms.txt implementation where appropriate and supported",
      "Website improvement report",
    ],
    footnote: "One-off project fee.",
    active: true,
    sortOrder: 1,
    kind: "package",
  },
  {
    key: "si-boost",
    name: "SI Boost",
    summary: "For businesses that want a broader upgrade of the site they already have.",
    audience: "The usual starting point when the website needs clearer pages, a design refresh and a stronger enquiry path.",
    priceExGstCents: 499_900,
    interval: null,
    badge: "Most Popular",
    cta: "Upgrade My Website",
    features: [
      "Everything in SI Ready",
      "Optimisation of up to 15 existing pages",
      "Advanced structured data",
      "Website design refresh",
      "Mobile usability improvements",
      "Website speed and performance optimisation",
      "Conversion and enquiry form improvements",
      "AI-focused FAQ content",
      "Competitor discovery analysis",
      "Google Business Profile optimisation",
      "Clearer service and location pages",
      "Basic booking or CRM integration",
      "AI visibility baseline report",
    ],
    footnote: "One-off project fee. The design refresh works with the site you already have.",
    active: true,
    sortOrder: 2,
    kind: "package",
  },
  {
    key: "si-complete",
    name: "SI Complete",
    summary: "For businesses wanting a complete website transformation.",
    audience: "A full redesign for a site that needs new layouts, more pages and a stronger path from visit to enquiry.",
    priceExGstCents: 899_900,
    interval: null,
    badge: null,
    cta: "Transform My Website",
    features: [
      "Everything in SI Boost",
      "Complete website redesign within an agreed scope",
      "Optimisation of up to 25 pages",
      "Advanced conversion-focused page layouts",
      "Comprehensive performance and mobile optimisation",
      "Clearer calls to action across key pages",
      "Advanced booking and CRM integrations",
      "Comprehensive AI discovery assessment",
      "Launch testing and handover",
    ],
    footnote: "One-off project fee. Redesign work is limited to the scope agreed before we start.",
    active: true,
    sortOrder: 3,
    kind: "package",
  },
  {
    key: "si-care",
    name: "SI Care",
    summary: "Ongoing website and AI discoverability management.",
    audience: "For businesses that want a person checking the site each month after the project.",
    priceExGstCents: 29_900,
    interval: "month",
    badge: null,
    cta: "Add SI Care",
    features: [
      "Monthly website health checks",
      "AI search visibility monitoring for selected prompts",
      "Minor content updates",
      "Technical optimisation maintenance",
      "Structured data maintenance",
      "Website performance monitoring",
      "Monthly reporting and improvement recommendations",
    ],
    footnote:
      "Fair use covers up to two hours of minor content updates a month and monitoring for up to 10 agreed prompts. It excludes new pages, redesigns, new features, photography, major copywriting and third-party licence fees. That work is quoted separately.",
    active: true,
    sortOrder: 4,
    kind: "subscription",
  },
  {
    key: "si-agent",
    name: "SI Agent",
    summary: "A branded AI website assistant.",
    audience: "Required to keep a hosted assistant running after setup.",
    priceExGstCents: 19_900,
    interval: "month",
    badge: null,
    cta: "Add SI Agent",
    features: [
      "AI agent hosting and operation",
      "Website chat interface",
      "Business knowledge management",
      "Customer question answering",
      "Lead capture and qualification",
      "Enquiry notifications",
      "Basic reporting",
      "Defined monthly usage allowance",
    ],
    footnote:
      "Includes 1,000 assistant replies a month. Extra usage is quoted before it is charged. The assistant answers from information you approve and hands complex conversations to your team. No specific third-party agent platform is connected on this website yet. We confirm the platform with you before go-live. The assistant only stays online while this subscription is active.",
    active: true,
    sortOrder: 5,
    kind: "subscription",
  },
]

export function toProductCreateData(product: PublicProduct) {
  return {
    key: product.key,
    name: product.name,
    summary: product.summary,
    audience: product.audience,
    priceExGstCents: product.priceExGstCents,
    interval: product.interval,
    badge: product.badge,
    cta: product.cta,
    features: JSON.stringify(product.features),
    footnote: product.footnote,
    active: product.active,
    sortOrder: product.sortOrder,
    kind: product.kind,
  }
}

export function parseFeatures(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed.map((item) => item.trim()).filter(Boolean)
    }
  } catch {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function toPublicProduct(row: {
  key: string
  name: string
  summary: string
  audience: string
  priceExGstCents: number
  interval: string | null
  badge: string | null
  cta: string
  features: string
  footnote: string | null
  active: boolean
  sortOrder: number
  kind: string
}): PublicProduct {
  return {
    key: row.key,
    name: row.name,
    summary: row.summary,
    audience: row.audience,
    priceExGstCents: row.priceExGstCents,
    interval: row.interval === "month" ? "month" : null,
    badge: row.badge,
    cta: row.cta,
    features: parseFeatures(row.features),
    footnote: row.footnote,
    active: row.active,
    sortOrder: row.sortOrder,
    kind: row.kind === "subscription" ? "subscription" : "package",
  }
}

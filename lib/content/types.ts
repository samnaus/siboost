export type Faq = { question: string; answer: string }
export type ComparisonRow = {
  feature: string
  ready: string
  boost: string
  complete: string
}
export type LegalSection = { heading: string; paragraphs: string[] }
export type DemoTurn = { prompt: string; user: string; assistant: string }

export type SiteContent = {
  business: { name: string; tagline: string; email: string; country: string }
  seo: Record<
    | "homeTitle"
    | "homeDescription"
    | "packagesTitle"
    | "packagesDescription"
    | "agentsTitle"
    | "agentsDescription"
    | "readinessTitle"
    | "readinessDescription"
    | "howTitle"
    | "howDescription"
    | "aboutTitle"
    | "aboutDescription"
    | "contactTitle"
    | "contactDescription",
    string
  >
  hero: {
    eyebrow: string
    headline: string
    subheadline: string
    primaryCta: string
    secondaryCta: string
  }
  searchShift: {
    eyebrow: string
    headline: string
    intro: string
    traditionalTitle: string
    traditional: string[]
    aiTitle: string
    ai: string[]
    note: string
  }
  pillars: {
    eyebrow: string
    headline: string
    intro: string
    items: { title: string; body: string }[]
  }
  packagesIntro: { eyebrow: string; headline: string; intro: string }
  subscriptionsIntro: {
    eyebrow: string
    headline: string
    intro: string
    combinedLabel: string
    combinedBody: string
  }
  comparison: { headline: string; intro: string; rows: ComparisonRow[] }
  agent: {
    eyebrow: string
    headline: string
    subheadline: string
    capabilities: string[]
    demoTitle: string
    demoDisclaimer: string
    demoBusiness: string
    script: DemoTurn[]
    fallbackReply: string
    providerNote: string
  }
  howItWorks: { eyebrow: string; headline: string; intro: string; steps: { title: string; body: string }[] }
  readiness: {
    eyebrow: string
    headline: string
    intro: string
    looksAt: string[]
    notIncluded: string
    successTitle: string
    successBody: string
  }
  faqs: Faq[]
  about: { eyebrow: string; headline: string; paragraphs: string[]; audience: string[] }
  contact: { eyebrow: string; headline: string; intro: string; response: string }
  privacy: { sections: LegalSection[] }
  terms: { sections: LegalSection[] }
}

import type { PublicProduct } from "@/lib/catalog"
import type { Faq, LegalSection } from "@/lib/content/types"
import { subscriptionsEnabled } from "@/lib/env"

const SUBSCRIPTION_COPY = /subscription|SI Care|SI Agent/i
const HIDDEN_TERMS = new Set(["Subscriptions", "Acceptable use of an assistant"])

export function publicProducts(products: PublicProduct[]) {
  const active = products.filter((product) => product.active)
  if (subscriptionsEnabled()) return active
  return active.filter((product) => product.kind !== "subscription")
}

export function publicFaqs(faqs: Faq[]) {
  if (subscriptionsEnabled()) return faqs
  return faqs.filter((faq) => !SUBSCRIPTION_COPY.test(`${faq.question} ${faq.answer}`))
}

export function faqHiddenWhileSubscriptionsOff(faq: Faq) {
  return !subscriptionsEnabled() && SUBSCRIPTION_COPY.test(`${faq.question} ${faq.answer}`)
}

export function publicTerms(sections: LegalSection[]) {
  if (subscriptionsEnabled()) return sections
  return sections.filter((section) => !HIDDEN_TERMS.has(section.heading))
}

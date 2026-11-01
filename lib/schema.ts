import type { PublicProduct } from "@/lib/catalog"
import type { Faq, SiteContent } from "@/lib/content/types"
import { siteUrl } from "@/lib/env"

export function organizationJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: content.business.name,
    url: siteUrl(),
    email: content.business.email,
    description: content.business.tagline,
    areaServed: { "@type": "Country", name: "New Zealand" },
    address: { "@type": "PostalAddress", addressCountry: "NZ" },
    knowsLanguage: "en-NZ",
  }
}

export function websiteJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.business.name,
    url: siteUrl(),
    description: content.seo.homeDescription,
    inLanguage: "en-NZ",
  }
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}

export function offersJsonLd(products: PublicProduct[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products
      .filter((product) => product.kind === "package")
      .map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: product.name,
          description: `${product.summary} Price excludes GST.`,
          price: (product.priceExGstCents / 100).toFixed(2),
          priceCurrency: "NZD",
          availability: "https://schema.org/InStock",
          url: `${siteUrl()}/packages`,
          valueAddedTaxIncluded: false,
        },
      })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  }
}

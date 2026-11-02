import { Suspense } from "react"
import { connection } from "next/server"
import { ComparisonTable } from "@/components/comparison-table"
import { FaqList } from "@/components/faq-list"
import { JsonLd } from "@/components/json-ld"
import { PackageCards } from "@/components/package-cards"
import { PaymentsNotice } from "@/components/payments-notice"
import { SubscriptionCards } from "@/components/subscription-cards"
import { getSiteContent } from "@/lib/content/get-content"
import { getPaymentsState, subscriptionsEnabled } from "@/lib/env"
import { chargeGst } from "@/lib/money"
import { getProducts } from "@/lib/products"
import { publicFaqs } from "@/lib/public-site"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd, offersJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.packagesTitle, content.seo.packagesDescription, "/packages")
}

export default function PackagesRoute() {
  return (
    <Suspense fallback={<p className="px-6 py-24 text-center text-slate-600">Loading packages.</p>}>
      <PackagesPage />
    </Suspense>
  )
}

async function PackagesPage() {
  await connection()
  const [content, products] = await Promise.all([getSiteContent(), getProducts()])
  const payments = getPaymentsState()
  const gst = chargeGst()
  const showSubscriptions = subscriptionsEnabled() && products.some((product) => product.kind === "subscription")
  const pricingFaqs = publicFaqs(content.faqs).filter((faq) => /GST|subscription|llms/i.test(faq.question))
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Packages", path: "/packages" },
        ])}
      />
      <JsonLd data={offersJsonLd(products)} />
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm font-semibold text-[#1d4ed8]">{content.packagesIntro.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
          {content.packagesIntro.headline}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{content.packagesIntro.intro}</p>
        <div className="mt-6">
          <PaymentsNotice payments={payments} />
        </div>
        <div className="mt-10">
          <PackageCards products={products} chargeGst={gst} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">{content.comparison.headline}</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{content.comparison.intro}</p>
        <div className="mt-6">
          <ComparisonTable rows={content.comparison.rows} />
        </div>
      </section>
      {showSubscriptions ? (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
            <p className="text-sm font-semibold text-[#1d4ed8]">{content.subscriptionsIntro.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">{content.subscriptionsIntro.headline}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{content.subscriptionsIntro.intro}</p>
            <div className="mt-8">
              <SubscriptionCards products={products} content={content} chargeGst={gst} />
            </div>
          </div>
        </section>
      ) : null}
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">Pricing questions</h2>
        <div className="mt-6">
          <FaqList faqs={pricingFaqs} />
        </div>
      </section>
    </>
  )
}

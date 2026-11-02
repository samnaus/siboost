import { CtaLink } from "@/components/cta-link"
import { FaqList } from "@/components/faq-list"
import { ReadinessForm } from "@/components/forms"
import { HeroIllustration } from "@/components/hero-illustration"
import { JsonLd } from "@/components/json-ld"
import { PackageCards } from "@/components/package-cards"
import { getSiteContent } from "@/lib/content/get-content"
import { chargeGst, formatNzdCompact } from "@/lib/money"
import { getProducts } from "@/lib/products"
import { publicFaqs } from "@/lib/public-site"
import { pageMetadata } from "@/lib/seo"
import { faqJsonLd, offersJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.homeTitle, content.seo.homeDescription, "/")
}

export default async function HomePage() {
  const [content, products] = await Promise.all([getSiteContent(), getProducts()])
  const gst = chargeGst()
  const faqs = publicFaqs(content.faqs)
  const fromPrice = Math.min(...products.filter((product) => product.kind === "package").map((product) => product.priceExGstCents))
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={offersJsonLd(products)} />
      <section className="hero-wash">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="text-sm font-semibold text-[#1d4ed8]">{content.hero.eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight text-balance text-[#0f172a] sm:text-5xl lg:text-6xl">
              {content.hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{content.hero.subheadline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/packages">{content.hero.primaryCta}</CtaLink>
              <CtaLink href="/check" variant="secondary">
                {content.hero.secondaryCta}
              </CtaLink>
            </div>
            <ul className="mt-8 space-y-2 text-sm text-slate-600">
              <li>One-off packages from {formatNzdCompact(fromPrice)} excl. GST.</li>
              <li>For New Zealand businesses that already have a website.</li>
            </ul>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-semibold text-[#1d4ed8]">{content.searchShift.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[#0f172a] md:text-4xl">
          {content.searchShift.headline}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{content.searchShift.intro}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold">{content.searchShift.traditionalTitle}</h3>
            <ol className="mt-4 space-y-4">
              {content.searchShift.traditional.map((step, index) => (
                <li key={step} className="flex gap-3 text-slate-700">
                  <span className="font-semibold text-slate-600">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6">
            <h3 className="text-lg font-bold">{content.searchShift.aiTitle}</h3>
            <ol className="mt-4 space-y-4">
              {content.searchShift.ai.map((step, index) => (
                <li key={step} className="flex gap-3 text-slate-700">
                  <span className="font-semibold text-[#1d4ed8]">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">{content.searchShift.note}</p>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="text-sm font-semibold text-[#1d4ed8]">{content.pillars.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{content.pillars.headline}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{content.pillars.intro}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.pillars.items.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#1d4ed8]">{content.packagesIntro.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{content.packagesIntro.headline}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{content.packagesIntro.intro}</p>
          </div>
          <CtaLink href="/packages" variant="secondary">
            Compare packages
          </CtaLink>
        </div>
        <div className="mt-10">
          <PackageCards products={products} chargeGst={gst} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-semibold text-[#1d4ed8]">{content.howItWorks.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{content.howItWorks.headline}</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {content.howItWorks.steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-slate-200 p-5">
              <p className="text-sm font-bold text-[#2563eb]">0{index + 1}</p>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#0f172a] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{content.readiness.headline}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">{content.readiness.intro}</p>
          </div>
          <ReadinessForm content={content} />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-3xl font-extrabold tracking-tight">Questions worth asking first</h2>
        <div className="mt-8">
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  )
}

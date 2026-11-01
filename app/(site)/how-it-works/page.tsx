import { CtaLink } from "@/components/cta-link"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.howTitle, content.seo.howDescription, "/how-it-works")
}

export default async function HowPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm font-semibold text-[#1d4ed8]">{content.howItWorks.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{content.howItWorks.headline}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{content.howItWorks.intro}</p>
        <ol className="mt-10 space-y-6">
          {content.howItWorks.steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-slate-200 p-6">
              <p className="text-sm font-bold text-[#2563eb]">Step {index + 1}</p>
              <h2 className="mt-1 text-2xl font-bold">{step.title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
        <h2 className="mt-12 text-2xl font-bold">What we need from you</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>The website address and who the business serves</li>
          <li>Access to the site, or a person who can publish changes</li>
          <li>Approval of any facts the assistant is allowed to say</li>
          <li>A decision on whether you want SI Care, SI Agent, both, or neither</li>
        </ul>
        <p className="mt-6 leading-7 text-slate-600">
          Timing depends on the package and how quickly we can access the website. We aim to reply to a new enquiry within two business days. We agree the scope before build work starts.
        </p>
        <div className="mt-8">
          <CtaLink href="/check">Start with your website</CtaLink>
        </div>
      </article>
    </>
  )
}

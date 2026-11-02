import { CtaLink } from "@/components/cta-link"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.readinessTitle, content.seo.readinessDescription, "/ai-search-readiness")
}

export default async function ReadinessPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI search readiness", path: "/ai-search-readiness" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm font-semibold text-[#1d4ed8]">AI search readiness</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
          Make the website easier to access and understand.
        </h1>
        <div className="mt-6 space-y-4 text-lg leading-8 text-slate-700">
          <p>
            AI search readiness means a person, and the tools they use, can find what your business does, where you work, and how to get in touch. It is ordinary clarity, structure and technical access.
          </p>
          <p>
            Traditional search still matters. Customers still open Google, compare websites and make their own shortlist. The same pages are now also read by AI search tools. A website needs to work for both, which is why crawlability, headings, structured data and plain-language service pages still do the heavy lifting.
          </p>
        </div>
        <h2 className="mt-10 text-2xl font-bold">What we usually improve</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>Page structure, internal links and whether important pages can be crawled</li>
          <li>Titles, headings and service descriptions that say who you help and where</li>
          <li>Structured data that matches the visible content</li>
          <li>Mobile usability, speed and the enquiry path</li>
          <li>A short llms.txt file where a platform supports it and it is appropriate</li>
        </ul>
        <h2 className="mt-10 text-2xl font-bold">What llms.txt is, and is not</h2>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          llms.txt is a plain text file some AI systems may request. It can summarise the business. It does not replace a crawlable website, useful pages, legitimate structured data or normal SEO. Siboost publishes one for this site at{" "}
          <a className="font-semibold text-[#1d4ed8] underline" href="/llms.txt">
            /llms.txt
          </a>
          . Adding the file to a client site is a small part of a package, not the strategy.
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-700">{content.searchShift.note}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaLink href="/check">Check my website</CtaLink>
          <CtaLink href="/packages" variant="secondary">
            See SI Ready
          </CtaLink>
        </div>
      </article>
    </>
  )
}

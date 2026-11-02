import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { publicTerms } from "@/lib/public-site"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export const metadata = pageMetadata(
  "Terms of service",
  "Draft terms for Siboost website upgrades. For legal review before publication.",
  "/terms",
)

export default async function TermsPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          Draft for legal review. These terms are not legal advice and should be checked before you rely on them.
        </p>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">Terms of service</h1>
        <div className="mt-8 space-y-8">
          {publicTerms(content.terms.sections).map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </>
  )
}

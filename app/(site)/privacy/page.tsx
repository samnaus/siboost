import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export const metadata = pageMetadata(
  "Privacy policy",
  "Draft privacy policy for Siboost, written for review under the New Zealand Privacy Act 2020.",
  "/privacy",
)

export default async function PrivacyPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          Draft for legal review. This is not legal advice and is not a final privacy policy.
        </p>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">Privacy policy</h1>
        <p className="mt-3 text-slate-600">Questions: {content.business.email}</p>
        <div className="mt-8 space-y-8">
          {content.privacy.sections.map((section) => (
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

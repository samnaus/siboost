import { ReadinessForm } from "@/components/forms"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata("Is your website AI ready?", content.seo.readinessDescription, "/check")
}

export default async function CheckPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Readiness check", path: "/check" },
        ])}
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-sm font-semibold text-[#1d4ed8]">{content.readiness.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{content.readiness.headline}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{content.readiness.intro}</p>
          <h2 className="mt-8 text-xl font-bold">A person will look at</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            {content.readiness.looksAt.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-slate-600">{content.readiness.notIncluded}</p>
        </div>
        <ReadinessForm content={content} />
      </section>
    </>
  )
}

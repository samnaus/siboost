import { ContactForm } from "@/components/forms"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.contactTitle, content.seo.contactDescription, "/contact")
}

export default async function ContactPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-sm font-semibold text-[#1d4ed8]">{content.contact.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{content.contact.headline}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{content.contact.intro}</p>
          <p className="mt-4 text-slate-700">{content.contact.response}</p>
          <p className="mt-6">
            <a className="font-semibold text-[#1d4ed8] underline" href={`mailto:${content.business.email}`}>
              {content.business.email}
            </a>
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Please do not send payment card numbers or passwords. Use the checkout page for payment once Stripe is connected.
          </p>
        </div>
        <ContactForm />
      </section>
    </>
  )
}

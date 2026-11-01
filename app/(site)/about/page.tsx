import Image from "next/image"
import { CtaLink } from "@/components/cta-link"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.aboutTitle, content.seo.aboutDescription, "/about")
}

export default async function AboutPage() {
  const content = await getSiteContent()
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-sm font-semibold text-[#1d4ed8]">{content.about.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">{content.about.headline}</h1>
        <div className="mt-6 space-y-4 text-lg leading-8 text-slate-700">
          {content.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <h2 className="mt-10 text-2xl font-bold">Who it is for</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {content.about.audience.map((item) => (
            <li key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
              {item}
            </li>
          ))}
        </ul>
        <figure className="mt-12 rounded-3xl border border-slate-200 p-6">
          <Image
            src="/brand/siboost-wordmark.png"
            alt="Siboost wordmark"
            width={1129}
            height={287}
            className="h-12 w-auto"
          />
          <figcaption className="mt-3 text-sm leading-6 text-slate-600">
            The supplied wordmark. On this website the name is set in type, in the same electric blue.
          </figcaption>
        </figure>
        <div className="mt-8">
          <CtaLink href="/contact">Contact Siboost</CtaLink>
        </div>
      </article>
    </>
  )
}

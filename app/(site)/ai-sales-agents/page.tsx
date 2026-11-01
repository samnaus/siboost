import { AgentDemo } from "@/components/agent-demo"
import { CtaLink } from "@/components/cta-link"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { formatNzdCompact } from "@/lib/money"
import { getProducts } from "@/lib/products"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

export async function generateMetadata() {
  const content = await getSiteContent()
  return pageMetadata(content.seo.agentsTitle, content.seo.agentsDescription, "/ai-sales-agents")
}

export default async function AgentsPage() {
  const [content, products] = await Promise.all([getSiteContent(), getProducts()])
  const agentPlan = products.find((product) => product.key === "si-agent")
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI sales agents", path: "/ai-sales-agents" },
        ])}
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-sm font-semibold text-[#1d4ed8]">{content.agent.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">{content.agent.headline}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{content.agent.subheadline}</p>
          <ul className="mt-6 space-y-2 text-slate-700">
            {content.agent.capabilities.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <AgentDemo agent={content.agent} />
      </section>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">What you are buying</h2>
          <div className="mt-4 space-y-4 text-lg leading-8 text-slate-700">
            <p>
              SI Boost and SI Complete include setup of a branded assistant. The assistant keeps answering customers only while an SI Agent subscription is active.
              {agentPlan
                ? ` SI Agent is ${formatNzdCompact(agentPlan.priceExGstCents)} a month excluding GST, with the allowance described on the package.`
                : " The monthly allowance is described on the package."}
            </p>
            <p>{content.agent.providerNote}</p>
            <p>
              The assistant should only use information you approve. It can collect contact details with consent, and it should hand a complex conversation to a person. It is not a guarantee of more enquiries.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/packages">View packages</CtaLink>
            <CtaLink href="/contact" variant="secondary">
              Talk to us
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  )
}

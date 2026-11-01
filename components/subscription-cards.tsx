import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import type { PublicProduct } from "@/lib/catalog"
import type { SiteContent } from "@/lib/content/types"
import { formatNzdCompact, inclusiveCents } from "@/lib/money"
import { cn } from "cn"

export function SubscriptionCards({
  products,
  content,
  chargeGst,
}: {
  products: PublicProduct[]
  content: SiteContent
  chargeGst: boolean
}) {
  const plans = products.filter((product) => product.kind === "subscription")
  const care = plans.find((product) => product.key === "si-care")
  const agent = plans.find((product) => product.key === "si-agent")
  const combined = care && agent ? care.priceExGstCents + agent.priceExGstCents : null

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((product) => (
        <article key={product.key} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-[#0f172a]">{product.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.summary}</p>
          <p className="mt-5 text-3xl font-extrabold tracking-tight">
            {formatNzdCompact(product.priceExGstCents)}
            <span className="text-base font-semibold text-slate-500"> / month</span>
          </p>
          <p className="text-sm text-slate-600">
            excl. GST
            {chargeGst ? ` · ${formatNzdCompact(inclusiveCents(product.priceExGstCents, true))} incl. GST` : null}
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm leading-6 text-slate-700">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          {product.footnote ? <p className="mt-4 text-sm leading-6 text-slate-600">{product.footnote}</p> : null}
          <Link
            href={`/checkout?subscribe=${product.key}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 h-11 rounded-full font-semibold")}
          >
            {product.cta}
          </Link>
        </article>
      ))}
      {combined !== null ? (
        <article className="flex h-full flex-col rounded-3xl bg-[#0f172a] p-6 text-white">
          <h2 className="text-xl font-bold">{content.subscriptionsIntro.combinedLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{content.subscriptionsIntro.combinedBody}</p>
          <p className="mt-5 text-3xl font-extrabold tracking-tight">
            {formatNzdCompact(combined)}
            <span className="text-base font-semibold text-slate-300"> / month</span>
          </p>
          <p className="text-sm text-slate-300">
            excl. GST
            {chargeGst ? ` · ${formatNzdCompact(inclusiveCents(combined, true))} incl. GST` : null}
          </p>
          <p className="mt-5 flex-1 text-sm leading-6 text-slate-300">
            Take both if you want the website looked after and the assistant kept online.
          </p>
          <Link
            href="/checkout?subscribe=si-care,si-agent"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 rounded-full font-semibold hover:bg-[#1d4ed8]")}
          >
            Add both
          </Link>
        </article>
      ) : null}
    </div>
  )
}

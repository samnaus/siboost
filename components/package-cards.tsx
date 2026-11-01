import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type { PublicProduct } from "@/lib/catalog"
import { formatNzdCompact, inclusiveCents } from "@/lib/money"
import { cn } from "cn"

export function PackageCards({
  products,
  chargeGst,
}: {
  products: PublicProduct[]
  chargeGst: boolean
}) {
  const packages = products.filter((product) => product.kind === "package")
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {packages.map((product) => {
        const featured = product.badge === "Most Popular"
        return (
          <article
            key={product.key}
            className={cn(
              "flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm",
              featured ? "border-[#2563eb] ring-2 ring-[#2563eb]/20" : "border-slate-200",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">{product.name}</h2>
              {product.badge ? <Badge>{product.badge}</Badge> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{product.summary}</p>
            <p className="mt-6 text-4xl font-extrabold tracking-tight text-[#0f172a]">
              {formatNzdCompact(product.priceExGstCents)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              excl. GST
              {chargeGst ? ` · ${formatNzdCompact(inclusiveCents(product.priceExGstCents, true))} incl. GST` : null}
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm leading-6 text-slate-700">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {product.footnote ? <p className="mt-5 text-sm leading-6 text-slate-600">{product.footnote}</p> : null}
            <Link
              href={`/checkout?package=${product.key}`}
              className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 rounded-full font-semibold hover:bg-[#1d4ed8]")}
            >
              {product.cta}
            </Link>
          </article>
        )
      })}
    </div>
  )
}

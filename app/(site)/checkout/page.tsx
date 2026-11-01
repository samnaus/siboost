import { Suspense } from "react"
import { connection } from "next/server"
import { CheckoutForm } from "@/components/checkout-form"
import { getPaymentsState } from "@/lib/env"
import { chargeGst } from "@/lib/money"
import { getProducts } from "@/lib/products"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Checkout",
  "Choose a Siboost package or subscription. Prices are in NZD and exclude GST.",
  "/checkout",
)

export default function CheckoutRoute({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; subscribe?: string }>
}) {
  return (
    <Suspense fallback={<p className="px-6 py-24 text-center">Loading checkout.</p>}>
      <Checkout searchParams={searchParams} />
    </Suspense>
  )
}

async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; subscribe?: string }>
}) {
  await connection()
  const params = await searchParams
  const products = await getProducts()
  const subscribe = (params.subscribe || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
        Choose the work you want. GST is shown before you continue. If online payments are not connected yet, this form is saved as an enquiry instead.
      </p>
      <div className="mt-8">
        <CheckoutForm
          products={products}
          initialPackage={params.package || ""}
          initialSubscriptions={subscribe}
          payments={getPaymentsState()}
          chargeGst={chargeGst()}
        />
      </div>
    </section>
  )
}

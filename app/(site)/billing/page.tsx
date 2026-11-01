import { Suspense } from "react"
import { connection } from "next/server"
import { BillingForm } from "@/components/billing-form"
import { PaymentsNotice } from "@/components/payments-notice"
import { getPaymentsState } from "@/lib/env"

export const metadata = {
  title: "Manage billing",
  description: "Open the Stripe customer portal to update a card, view invoices or cancel a Siboost subscription.",
  robots: { index: false, follow: false },
}

export default function BillingRoute() {
  return (
    <Suspense fallback={<p className="px-6 py-24 text-center">Loading billing.</p>}>
      <BillingPage />
    </Suspense>
  )
}

async function BillingPage() {
  await connection()
  const payments = getPaymentsState()
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Manage billing</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Use the email from your order to open the Stripe customer portal. From there you can update the payment method, view invoices and cancel a subscription. Siboost does not store card numbers.
      </p>
      <div className="mt-6">
        <PaymentsNotice payments={payments} />
      </div>
      <div className="mt-8">
        <BillingForm />
      </div>
    </section>
  )
}

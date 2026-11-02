"use client"

import { useActionState, useState } from "react"
import { startCheckout } from "@/app/actions/checkout"
import { PaymentsNotice } from "@/components/payments-notice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PublicProduct } from "@/lib/catalog"
import { quoteCheckout } from "@/lib/checkout-quote"
import type { PaymentsState } from "@/lib/env"
import { formatNzd } from "@/lib/money"
import { initialActionState } from "@/lib/validation"

export function CheckoutForm({
  products,
  initialPackage,
  initialSubscriptions,
  payments,
  chargeGst,
}: {
  products: PublicProduct[]
  initialPackage: string
  initialSubscriptions: string[]
  payments: PaymentsState
  chargeGst: boolean
}) {
  const [state, action, pending] = useActionState(startCheckout, initialActionState)
  const [packageKey, setPackageKey] = useState(initialPackage)
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const packages = products.filter((product) => product.kind === "package")
  const plans = products.filter((product) => product.kind === "subscription")
  const quoted = quoteCheckout({ packageKey, subscriptionKeys: subscriptions }, products, { chargeGst })
  const errors = state.fieldErrors ?? {}

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" noValidate>
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Fax
          <input name="faxNumber" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5">
        <PaymentsNotice payments={payments} />
        {state.formError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {state.formError}
          </p>
        ) : null}
        <fieldset className="grid gap-3">
          <legend className="text-base font-semibold text-[#0f172a]">Package</legend>
          {plans.length > 0 ? (
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <input
                type="radio"
                name="packageKey"
                value=""
                defaultChecked={initialPackage === ""}
                className="size-4 accent-[#2563eb]"
                onChange={() => setPackageKey("")}
              />
              No package. Subscriptions only.
            </label>
          ) : null}
          {packages.map((product) => (
            <label key={product.key} className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <input
                type="radio"
                name="packageKey"
                value={product.key}
                defaultChecked={initialPackage === product.key}
                className="mt-1 size-4 accent-[#2563eb]"
                onChange={() => setPackageKey(product.key)}
              />
              <span>
                <span className="font-semibold text-[#0f172a]">{product.name}</span>
                <span className="mt-1 block text-slate-600">{product.summary}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {plans.length > 0 ? (
        <fieldset className="grid gap-3">
          <legend className="text-base font-semibold text-[#0f172a]">Optional subscriptions</legend>
          {plans.map((product) => (
            <label key={product.key} className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <Checkbox
                name="subscriptionKeys"
                value={product.key}
                defaultChecked={initialSubscriptions.includes(product.key)}
                className="mt-1"
                onCheckedChange={(checked) => {
                  setSubscriptions((current) =>
                    checked ? [...new Set([...current, product.key])] : current.filter((key) => key !== product.key),
                  )
                }}
              />
              <span>
                <span className="font-semibold text-[#0f172a]">{product.name}</span>
                <span className="mt-1 block text-slate-600">{product.summary}</span>
              </span>
            </label>
          ))}
        </fieldset>
        ) : null}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="checkout-name">Contact name</Label>
            <Input id="checkout-name" name="contactName" required autoComplete="name" className="h-11 md:text-base" aria-invalid={Boolean(errors.contactName)} />
            {errors.contactName ? <p className="text-sm text-red-700">{errors.contactName}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="checkout-email">Email address</Label>
            <Input id="checkout-email" name="email" type="email" required autoComplete="email" className="h-11 md:text-base" aria-invalid={Boolean(errors.email)} />
            {errors.email ? <p className="text-sm text-red-700">{errors.email}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="checkout-business">Business name</Label>
            <Input id="checkout-business" name="businessName" required autoComplete="organization" className="h-11 md:text-base" aria-invalid={Boolean(errors.businessName)} />
            {errors.businessName ? <p className="text-sm text-red-700">{errors.businessName}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="checkout-website">Website (optional)</Label>
            <Input id="checkout-website" name="websiteUrl" type="url" autoComplete="url" placeholder="https://" className="h-11 md:text-base" />
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <Checkbox name="consent" value="yes" required className="mt-1" />
          <span>
            I agree to Siboost using these details to process this order and contact me about it. I have read the{" "}
            <a className="font-semibold text-[#1d4ed8] underline" href="/terms">
              terms
            </a>{" "}
            and{" "}
            <a className="font-semibold text-[#1d4ed8] underline" href="/privacy">
              privacy policy
            </a>
            , which are drafts for legal review.
          </span>
        </label>
        {errors.consent ? <p className="text-sm text-red-700">{errors.consent}</p> : null}
        <Button type="submit" disabled={pending} className="h-11 rounded-full font-semibold hover:bg-[#1d4ed8]">
          {pending ? "Working…" : payments.configured ? "Continue to secure payment" : "Request this by enquiry"}
        </Button>
      </div>
      <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-[#0f172a]">Order summary</h2>
        {quoted.ok ? (
          <div className="mt-4 space-y-3 text-sm">
            {quoted.quote.lines.map((line) => (
              <div key={line.key} className="flex justify-between gap-4">
                <span>
                  {line.name}
                  <span className="block text-slate-500">{line.interval ? "Monthly, excl. GST" : "One-off, excl. GST"}</span>
                </span>
                <span className="font-semibold">{formatNzd(line.exGstCents)}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-3">
              <Row label="Subtotal excl. GST" value={formatNzd(quoted.quote.exGstCents)} />
              <Row label={chargeGst ? "GST 15%" : "GST"} value={formatNzd(quoted.quote.gstCents)} />
              <Row label="Total" value={formatNzd(quoted.quote.incGstCents)} strong />
            </div>
            {quoted.quote.agentWarning ? <p className="leading-6 text-slate-700">{quoted.quote.agentWarning}</p> : null}
            {quoted.quote.bundleNote ? <p className="leading-6 text-slate-700">{quoted.quote.bundleNote}</p> : null}
            {quoted.quote.recurringExGstCents > 0 ? (
              <p className="leading-6 text-slate-600">
                The monthly amount of {formatNzd(quoted.quote.recurringExGstCents)} excl. GST renews until cancelled. One-off work is charged once.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-700">{quoted.error}</p>
        )}
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Card details are entered on Stripe. Siboost does not store card numbers.
        </p>
      </aside>
    </form>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${strong ? "text-base font-bold text-[#0f172a]" : "text-slate-700"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

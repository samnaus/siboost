"use server"

import { redirect } from "next/navigation"
import { buildSessionParams } from "@/lib/billing"
import { quoteCheckout } from "@/lib/checkout-quote"
import { chargeGst } from "@/lib/money"
import { getAllProducts } from "@/lib/products"
import { saveEnquiry } from "@/lib/leads"
import { getPaymentsState, siteUrl, subscriptionsEnabled } from "@/lib/env"
import { getOrCreateGstTaxRate, getStripe } from "@/lib/stripe"
import { isNextRedirect, limitAction, text } from "@/lib/request"
import { checkoutSchema, fieldErrorsFromZod, type ActionState } from "@/lib/validation"

export async function startCheckout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = checkoutSchema.safeParse({
    contactName: text(formData, "contactName"),
    email: text(formData, "email"),
    businessName: text(formData, "businessName"),
    websiteUrl: text(formData, "websiteUrl"),
    packageKey: text(formData, "packageKey"),
    subscriptionKeys: formData.getAll("subscriptionKeys").filter((value): value is string => typeof value === "string"),
    consent: text(formData, "consent"),
    faxNumber: text(formData, "faxNumber"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error), formError: "Please check the highlighted fields." }
  }
  if (parsed.data.faxNumber) redirect("/checkout/received")

  const limit = await limitAction("checkout")
  if (!limit.ok) {
    return { ok: false, formError: "Please wait a few minutes before trying again." }
  }

  if (!subscriptionsEnabled() && parsed.data.subscriptionKeys.some((key) => key.trim())) {
    return { ok: false, formError: "Monthly subscriptions are not available." }
  }

  const products = await getAllProducts()
  const quoted = quoteCheckout(
    { packageKey: parsed.data.packageKey, subscriptionKeys: parsed.data.subscriptionKeys },
    products,
    { chargeGst: chargeGst() },
  )
  if (!quoted.ok) return { ok: false, formError: quoted.error }

  const summary = quoted.quote.lines
    .map((line) => `${line.name} (${line.interval ? "monthly" : "one-off"})`)
    .join(", ")
  const fallbackMessage = `Checkout request for ${summary}. Website: ${parsed.data.websiteUrl || "not supplied"}.`

  const payments = getPaymentsState()
  const stripe = getStripe()
  if (!payments.configured || !stripe) {
    await saveEnquiry({
      type: "checkout",
      name: parsed.data.contactName,
      email: parsed.data.email,
      businessName: parsed.data.businessName,
      websiteUrl: parsed.data.websiteUrl,
      packageInterest: parsed.data.packageKey,
      subscriptionInterest: parsed.data.subscriptionKeys.join(","),
      message: `${fallbackMessage} Payments are not yet configured, so this was saved as an enquiry.`,
    })
    redirect("/checkout/received")
  }

  try {
    const taxRateId = chargeGst() ? await getOrCreateGstTaxRate(stripe) : null
    const origin = siteUrl()
    const params = buildSessionParams({
      quote: quoted.quote,
      taxRateId,
      email: parsed.data.email,
      contactName: parsed.data.contactName,
      businessName: parsed.data.businessName,
      websiteUrl: parsed.data.websiteUrl || "",
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/checkout/cancelled`,
    })
    const session = await stripe.checkout.sessions.create(params)
    if (!session.url) throw new Error("Stripe did not return a checkout URL.")
    redirect(session.url)
  } catch (error) {
    if (isNextRedirect(error)) throw error
    console.error("[checkout]", error)
    await saveEnquiry({
      type: "checkout",
      name: parsed.data.contactName,
      email: parsed.data.email,
      businessName: parsed.data.businessName,
      websiteUrl: parsed.data.websiteUrl,
      packageInterest: parsed.data.packageKey,
      subscriptionInterest: parsed.data.subscriptionKeys.join(","),
      message: `${fallbackMessage} Online checkout failed, so this was saved as an enquiry.`,
    })
    redirect("/checkout/received?saved=1")
  }
}

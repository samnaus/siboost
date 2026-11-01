import Stripe from "stripe"
import { getPaymentsState } from "@/lib/env"

let client: Stripe | null = null

export function getStripe() {
  const state = getPaymentsState()
  if (!state.configured) return null
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  if (!client) client = new Stripe(key)
  return client
}

export async function getOrCreateGstTaxRate(stripe: Stripe) {
  const configured = process.env.STRIPE_GST_TAX_RATE_ID?.trim()
  if (configured) return configured
  const existing = await stripe.taxRates.list({ active: true, limit: 100 })
  const found = existing.data.find(
    (rate) =>
      rate.percentage === 15 &&
      rate.inclusive === false &&
      rate.country === "NZ" &&
      rate.display_name === "GST",
  )
  if (found) return found.id
  const created = await stripe.taxRates.create({
    display_name: "GST",
    description: "New Zealand GST",
    jurisdiction: "NZ",
    country: "NZ",
    percentage: 15,
    inclusive: false,
  })
  return created.id
}

export async function getPortalConfiguration(stripe: Stripe) {
  const configured = process.env.STRIPE_PORTAL_CONFIGURATION_ID?.trim()
  if (configured) return configured
  const existing = await stripe.billingPortal.configurations.list({ active: true, limit: 1 })
  if (existing.data[0]) return existing.data[0].id
  const created = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Manage your Siboost billing",
    },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: {
        enabled: true,
        allowed_updates: ["email", "address", "name", "phone", "tax_id"],
      },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
      },
    },
  })
  return created.id
}

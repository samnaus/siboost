"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { getPaymentsState, siteUrl } from "@/lib/env"
import { isNextRedirect } from "@/lib/request"
import { getPortalConfiguration, getStripe } from "@/lib/stripe"
import { billingLookupSchema, fieldErrorsFromZod, type ActionState } from "@/lib/validation"

export async function openBillingPortal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = billingLookupSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error) }
  }
  const payments = getPaymentsState()
  const stripe = getStripe()
  if (!payments.configured || !stripe) {
    return { ok: false, formError: "Payments are not yet configured, so the billing portal is unavailable." }
  }
  const customer = await prisma.customer.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  })
  if (!customer?.stripeCustomerId) {
    return { ok: false, formError: "We couldn't find a billing account for that email." }
  }
  try {
    const configuration = await getPortalConfiguration(stripe)
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: `${siteUrl()}/billing`,
      configuration,
    })
    redirect(session.url)
  } catch (error) {
    if (isNextRedirect(error)) throw error
    console.error("[billing-portal]", error)
    return { ok: false, formError: "The billing portal could not be opened. Try again shortly." }
  }
}

import type { Prisma, PrismaClient } from "@prisma/client"
import type Stripe from "stripe"
import { compactItems, type CheckoutQuote } from "@/lib/checkout-quote"
import type { EmailMessage, EmailResult } from "@/lib/email"
import { orderEmail } from "@/lib/email"
import { siteUrl } from "@/lib/env"
import { formatNzd, gstCentsFromExclusive } from "@/lib/money"

type Db = PrismaClient | Prisma.TransactionClient

export type CheckoutItem = { k: string; n: string; c: number; i: string }

export type CheckoutSnapshot = {
  id: string
  mode: "payment" | "subscription"
  paymentStatus: string | null
  customerEmail: string | null
  customerName: string | null
  stripeCustomerId: string | null
  currency: string | null
  subscriptionId: string | null
  paymentIntentId: string | null
  metadata: {
    contactName?: string
    businessName?: string
    websiteUrl?: string
    items?: string
  }
}

export function snapshotFromSession(session: Stripe.Checkout.Session): CheckoutSnapshot {
  const customer = session.customer
  const subscription = session.subscription
  const paymentIntent = session.payment_intent
  return {
    id: session.id,
    mode: session.mode === "subscription" ? "subscription" : "payment",
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email || session.customer_email || null,
    customerName: session.customer_details?.name ?? null,
    stripeCustomerId: typeof customer === "string" ? customer : customer?.id || null,
    currency: session.currency,
    subscriptionId: typeof subscription === "string" ? subscription : subscription?.id || null,
    paymentIntentId: typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id || null,
    metadata: session.metadata ?? {},
  }
}

export function parseItems(raw: string | undefined): CheckoutItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return []
      const record = item as Partial<CheckoutItem>
      if (typeof record.k !== "string" || typeof record.n !== "string" || typeof record.c !== "number") return []
      return [{ k: record.k, n: record.n, c: record.c, i: record.i === "month" ? "month" : "" }]
    })
  } catch {
    return []
  }
}

export function buildSessionParams(input: {
  quote: CheckoutQuote
  taxRateId: string | null
  email: string
  contactName: string
  businessName: string
  websiteUrl: string
  successUrl: string
  cancelUrl: string
}): Stripe.Checkout.SessionCreateParams {
  const metadata = {
    contactName: input.contactName.slice(0, 200),
    businessName: input.businessName.slice(0, 200),
    websiteUrl: input.websiteUrl.slice(0, 300),
    items: compactItems(input.quote).slice(0, 500),
  }
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = input.quote.lines.map((line) => ({
    quantity: 1,
    ...(input.taxRateId ? { tax_rates: [input.taxRateId] } : {}),
    price_data: {
      currency: "nzd",
      unit_amount: line.exGstCents,
      tax_behavior: "exclusive",
      product_data: {
        name: line.name,
        description: line.interval
          ? "Monthly subscription. Price excludes GST."
          : "One-off project fee. Price excludes GST.",
      },
      ...(line.interval ? { recurring: { interval: "month" as const } } : {}),
    },
  }))

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: input.quote.mode,
    customer_email: input.email,
    client_reference_id: input.businessName.slice(0, 200),
    line_items: lineItems,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    tax_id_collection: { enabled: true },
    automatic_tax: { enabled: false },
    allow_promotion_codes: false,
    custom_text: {
      submit: {
        message: input.taxRateId
          ? "Prices exclude GST. New Zealand GST at 15% is added before you pay."
          : "GST is not being added to this checkout.",
      },
    },
  }

  if (input.quote.mode === "payment") {
    params.customer_creation = "always"
    params.invoice_creation = { enabled: true }
  }

  return params
}

export async function recordCheckout(
  db: PrismaClient,
  snapshot: CheckoutSnapshot,
  notify: (message: EmailMessage) => Promise<EmailResult>,
) {
  const email = snapshot.customerEmail?.trim().toLowerCase()
  if (!email) {
    throw new Error("Checkout session is missing a customer email.")
  }
  const items = parseItems(snapshot.metadata.items)
  if (items.length === 0) {
    throw new Error("Checkout session is missing item metadata.")
  }

  const paid = snapshot.paymentStatus === "paid" || snapshot.paymentStatus === "no_payment_required"
  const purchaseStatus = paid ? "paid" : "pending"
  const subscriptionStatus = paid ? "active" : "incomplete"
  const businessName = snapshot.metadata.businessName || snapshot.customerName || null

  const recorded = await db.$transaction(async (tx) => {
    const already = await tx.purchase.findFirst({
      where: { stripeCheckoutSessionId: snapshot.id },
    })
    const alreadySub = await tx.subscription.findFirst({
      where: { stripeCheckoutSessionId: snapshot.id },
    })
    if (already || alreadySub) return false

    const customer = await tx.customer.upsert({
      where: { email },
      create: {
        email,
        name: snapshot.metadata.contactName || snapshot.customerName,
        businessName,
        websiteUrl: snapshot.metadata.websiteUrl || null,
        stripeCustomerId: snapshot.stripeCustomerId,
      },
      update: {
        name: snapshot.metadata.contactName || snapshot.customerName || undefined,
        businessName: businessName || undefined,
        websiteUrl: snapshot.metadata.websiteUrl || undefined,
        stripeCustomerId: snapshot.stripeCustomerId || undefined,
      },
    })

    for (const item of items) {
      const gst = gstCentsFromExclusive(item.c)
      if (item.i === "month") {
        await tx.subscription.create({
          data: {
            customerId: customer.id,
            productKey: item.k,
            productName: item.n,
            amountExGstCents: item.c,
            status: subscriptionStatus,
            stripeSubscriptionId: snapshot.subscriptionId,
            stripeCheckoutSessionId: snapshot.id,
          },
        })
      } else {
        await tx.purchase.create({
          data: {
            customerId: customer.id,
            productKey: item.k,
            productName: item.n,
            amountExGstCents: item.c,
            gstCents: gst,
            amountIncGstCents: item.c + gst,
            currency: snapshot.currency || "nzd",
            status: purchaseStatus,
            stripeCheckoutSessionId: snapshot.id,
            stripePaymentIntentId: snapshot.paymentIntentId,
          },
        })
      }
    }
    return true
  })

  const alreadySent = await db.emailLog.findFirst({
    where: { relatedId: snapshot.id, status: { in: ["sent", "logged"] } },
  })
  if (alreadySent) return { recorded, emailStatus: alreadySent.status }

  const exGst = items.reduce((sum, item) => sum + item.c, 0)
  const gst = items.reduce((sum, item) => sum + gstCentsFromExclusive(item.c), 0)
  const emailResult = await notify(
    orderEmail({
      to: email,
      contactName: snapshot.metadata.contactName || "there",
      businessName: businessName || "your business",
      lines: items.map((item) => ({
        name: item.n,
        exGst: formatNzd(item.c),
        interval: item.i === "month" ? "month" : null,
      })),
      exGst: formatNzd(exGst),
      gst: formatNzd(gst),
      total: formatNzd(exGst + gst),
      billingUrl: `${siteUrl()}/billing`,
      testMode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false,
      relatedId: snapshot.id,
    }),
  )

  return { recorded, emailStatus: emailResult.status }
}

export async function markCheckoutFailed(db: Db, sessionId: string) {
  await db.purchase.updateMany({
    where: { stripeCheckoutSessionId: sessionId, status: "pending" },
    data: { status: "failed" },
  })
  await db.subscription.updateMany({
    where: { stripeCheckoutSessionId: sessionId, status: "incomplete" },
    data: { status: "incomplete" },
  })
}

export async function syncSubscription(
  db: Db,
  subscription: Stripe.Subscription,
) {
  const periodEnd = subscription.items?.data?.[0]?.current_period_end
  await db.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
    },
  })
}

export function subscriptionIdFromInvoice(invoice: Stripe.Invoice) {
  const subscription = invoice.parent?.subscription_details?.subscription
  if (!subscription) return null
  return typeof subscription === "string" ? subscription : subscription.id
}

export async function syncInvoice(db: Db, invoice: Stripe.Invoice, type: string) {
  const subscriptionId = subscriptionIdFromInvoice(invoice)
  if (!subscriptionId) return
  await db.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: type === "invoice.paid" ? "active" : "past_due" },
  })
}

export async function processStripeEvent(
  db: PrismaClient,
  event: Stripe.Event,
  notify: (message: EmailMessage) => Promise<EmailResult>,
) {
  const existing = await db.stripeEvent.findUnique({ where: { id: event.id } })
  if (existing) return { duplicate: true as const }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await recordCheckout(db, snapshotFromSession(event.data.object as Stripe.Checkout.Session), notify)
      break
    case "checkout.session.async_payment_failed":
      await markCheckoutFailed(db, (event.data.object as Stripe.Checkout.Session).id)
      break
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(db, event.data.object as Stripe.Subscription)
      break
    case "invoice.paid":
    case "invoice.payment_failed":
      await syncInvoice(db, event.data.object as Stripe.Invoice, event.type)
      break
    default:
      break
  }

  try {
    await db.stripeEvent.create({ data: { id: event.id, type: event.type } })
  } catch (error) {
    if (isUniqueError(error)) return { duplicate: true as const }
    throw error
  }
  return { duplicate: false as const }
}

function isUniqueError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002")
}

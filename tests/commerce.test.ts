import assert from "node:assert/strict"
import { after, before, describe, it } from "node:test"
import { PrismaClient } from "@prisma/client"
import { defaultCatalog } from "../lib/catalog"
import { quoteCheckout } from "../lib/checkout-quote"
import { buildSessionParams, parseItems, processStripeEvent, recordCheckout, snapshotFromSession } from "../lib/billing"
import { mergeSiteContent } from "../lib/content/merge"
import { defaultSiteContent } from "../lib/content/defaults"
import { getPaymentsState } from "../lib/env"
import { dollarsToCents, formatNzd, gstCentsFromExclusive } from "../lib/money"
import { renderLlmsTxt } from "../lib/llms"
import { publicFaqs } from "../lib/public-site"
import { readinessSchema } from "../lib/validation"

const prisma = new PrismaClient()

describe("money", () => {
  it("calculates 15% GST in cents without float drift", () => {
    assert.equal(gstCentsFromExclusive(199_900, true), 29_985)
    assert.equal(gstCentsFromExclusive(499_900, true), 74_985)
    assert.equal(gstCentsFromExclusive(899_900, true), 134_985)
    assert.equal(gstCentsFromExclusive(29_900, true), 4_485)
    assert.equal(gstCentsFromExclusive(19_900, true), 2_985)
    assert.equal(gstCentsFromExclusive(19_900, false), 0)
  })

  it("parses dollar input into cents", () => {
    assert.equal(dollarsToCents("1999"), 199_900)
    assert.equal(dollarsToCents("$299.00"), 29_900)
    assert.equal(dollarsToCents("1.5"), 150)
    assert.equal(dollarsToCents("nope"), null)
  })

  it("formats New Zealand dollars", () => {
    assert.equal(formatNzd(199_900), "$1,999.00")
  })
})

describe("checkout quote", () => {
  it("prices a package and both subscriptions, with GST", () => {
    const result = quoteCheckout(
      { packageKey: "si-boost", subscriptionKeys: ["si-care", "si-agent"] },
      defaultCatalog,
      { chargeGst: true },
    )
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.quote.mode, "subscription")
    assert.equal(result.quote.exGstCents, 499_900 + 29_900 + 19_900)
    assert.equal(result.quote.gstCents, 74_985 + 4_485 + 2_985)
    assert.equal(result.quote.agentWarning, null)
    assert.ok(result.quote.bundleNote)
  })

  it("uses payment mode for a package alone", () => {
    const result = quoteCheckout({ packageKey: "si-boost", subscriptionKeys: [] }, defaultCatalog, { chargeGst: true })
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.quote.mode, "payment")
    assert.equal(result.quote.agentWarning, null)
  })

  it("rejects an empty selection", () => {
    const result = quoteCheckout({ packageKey: "", subscriptionKeys: [] }, defaultCatalog)
    assert.equal(result.ok, false)
  })

  it("builds Stripe line items with an exclusive GST rate", () => {
    const result = quoteCheckout({ packageKey: "si-ready", subscriptionKeys: ["si-agent"] }, defaultCatalog, { chargeGst: true })
    assert.equal(result.ok, true)
    if (!result.ok) return
    const params = buildSessionParams({
      quote: result.quote,
      taxRateId: "txr_test",
      email: "owner@example.co.nz",
      contactName: "Alex",
      businessName: "Example Homes",
      websiteUrl: "https://example.co.nz",
      successUrl: "https://siboost.test/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancelUrl: "https://siboost.test/checkout/cancelled",
    })
    assert.equal(params.mode, "subscription")
    assert.equal(params.line_items?.length, 2)
    assert.equal(params.line_items?.[0].price_data?.unit_amount, 199_900)
    assert.equal(params.line_items?.[0].price_data?.currency, "nzd")
    assert.deepEqual(params.line_items?.[1].tax_rates, ["txr_test"])
    assert.equal(params.line_items?.[1].price_data?.recurring?.interval, "month")
    const rawItems = params.metadata?.items
    const items = parseItems(typeof rawItems === "string" ? rawItems : undefined)
    assert.equal(items.length, 2)
    assert.equal(items[0].k, "si-ready")
  })
})

describe("payments state", () => {
  const original = process.env.STRIPE_SECRET_KEY
  const allow = process.env.ALLOW_LIVE_STRIPE
  after(() => {
    if (original === undefined) delete process.env.STRIPE_SECRET_KEY
    else process.env.STRIPE_SECRET_KEY = original
    if (allow === undefined) delete process.env.ALLOW_LIVE_STRIPE
    else process.env.ALLOW_LIVE_STRIPE = allow
  })

  it("stays unconfigured without a key", () => {
    delete process.env.STRIPE_SECRET_KEY
    assert.equal(getPaymentsState().mode, "unconfigured")
    assert.match(getPaymentsState().message || "", /not yet configured/i)
  })

  it("locks live keys unless explicitly allowed", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_example"
    delete process.env.ALLOW_LIVE_STRIPE
    assert.equal(getPaymentsState().configured, false)
    assert.equal(getPaymentsState().mode, "live_locked")
    process.env.ALLOW_LIVE_STRIPE = "true"
    assert.equal(getPaymentsState().mode, "live")
  })

  it("accepts test keys", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_example"
    assert.equal(getPaymentsState().mode, "test")
    assert.equal(getPaymentsState().configured, true)
  })
})

describe("content and validation", () => {
  it("merges copy and replaces FAQ arrays", () => {
    const merged = mergeSiteContent(defaultSiteContent, {
      hero: { headline: "A new headline for the test" },
      faqs: [{ question: "Only this question remains here?", answer: "Yes, the saved list replaces the default list." }],
    })
    assert.equal(merged.hero.headline, "A new headline for the test")
    assert.equal(merged.hero.subheadline, defaultSiteContent.hero.subheadline)
    assert.equal(merged.faqs.length, 1)
  })

  it("rejects a readiness check without consent", () => {
    const parsed = readinessSchema.safeParse({
      websiteUrl: "https://example.co.nz",
      businessName: "Example Homes",
      contactName: "Alex",
      email: "alex@example.co.nz",
      consent: "",
    })
    assert.equal(parsed.success, false)
  })

  it("describes llms.txt as a summary, not a substitute", () => {
    const previous = process.env.SUBSCRIPTIONS_ENABLED
    delete process.env.SUBSCRIPTIONS_ENABLED
    const text = renderLlmsTxt(defaultSiteContent, defaultCatalog)
    if (previous === undefined) delete process.env.SUBSCRIPTIONS_ENABLED
    else process.env.SUBSCRIPTIONS_ENABLED = previous
    assert.match(text, /does not replace a crawlable website/i)
    assert.doesNotMatch(text, /does not guarantee/i)
    assert.doesNotMatch(text, /ai-sales-agents/i)
    assert.doesNotMatch(text, /SI Care/)
    assert.match(text, /SI Boost/)
  })

  it("keeps package lists free of sales-agent offers and hides subscription FAQs by default", () => {
    const previous = process.env.SUBSCRIPTIONS_ENABLED
    delete process.env.SUBSCRIPTIONS_ENABLED
    const boost = defaultCatalog.find((product) => product.key === "si-boost")
    const complete = defaultCatalog.find((product) => product.key === "si-complete")
    assert.ok(boost && complete)
    const features = [...boost.features, ...complete.features].join("\n")
    assert.doesNotMatch(features, /sales agent|lead capture and qualification|knowledge sources/i)
    assert.equal(
      defaultSiteContent.comparison.rows.some((row) => /sales agent|lead capture|knowledge sources|lead follow-up/i.test(row.feature)),
      false,
    )
    const faqs = publicFaqs(defaultSiteContent.faqs)
    assert.equal(faqs.some((faq) => /subscription/i.test(faq.question)), false)
    assert.match(
      defaultSiteContent.terms.sections.flatMap((section) => section.paragraphs).join(" "),
      /We do not guarantee rankings, recommendations or enquiries/,
    )
    if (previous === undefined) delete process.env.SUBSCRIPTIONS_ENABLED
    else process.env.SUBSCRIPTIONS_ENABLED = previous
  })
})

describe("webhook recording", () => {
  before(async () => {
    await prisma.emailLog.deleteMany()
    await prisma.stripeEvent.deleteMany()
    await prisma.purchase.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.customer.deleteMany()
  })

  after(async () => {
    await prisma.$disconnect()
  })

  it("records a paid package and subscription once, then ignores the duplicate event", async () => {
    const emails: string[] = []
    const session = {
      id: "cs_test_123",
      object: "checkout.session",
      mode: "subscription",
      payment_status: "paid",
      status: "complete",
      customer_email: "owner@example.co.nz",
      customer_details: { email: "owner@example.co.nz", name: "Alex Owner" },
      customer: "cus_test_123",
      subscription: "sub_test_123",
      payment_intent: "pi_test_123",
      currency: "nzd",
      metadata: {
        contactName: "Alex Owner",
        businessName: "Example Homes",
        websiteUrl: "https://example.co.nz",
        items: JSON.stringify([
          { k: "si-ready", n: "SI Ready", c: 199_900, i: "" },
          { k: "si-agent", n: "SI Agent", c: 19_900, i: "month" },
        ]),
      },
    }
    const event = {
      id: "evt_test_123",
      type: "checkout.session.completed",
      data: { object: session },
    }
    const notify = async (message: { to: string; subject: string }) => {
      emails.push(`${message.to}:${message.subject}`)
      return { status: "logged" as const, provider: "test" }
    }
    const first = await processStripeEvent(prisma, event as never, notify)
    const second = await processStripeEvent(prisma, event as never, notify)
    assert.equal(first.duplicate, false)
    assert.equal(second.duplicate, true)
    assert.equal(emails.length, 1)
    const customer = await prisma.customer.findUnique({ where: { email: "owner@example.co.nz" } })
    assert.ok(customer)
    assert.equal(customer?.stripeCustomerId, "cus_test_123")
    const purchase = await prisma.purchase.findFirst({ where: { customerId: customer?.id } })
    assert.equal(purchase?.status, "paid")
    assert.equal(purchase?.gstCents, 29_985)
    assert.equal(purchase?.amountIncGstCents, 229_885)
    const subscription = await prisma.subscription.findFirst({ where: { customerId: customer?.id } })
    assert.equal(subscription?.status, "active")
    assert.equal(subscription?.stripeSubscriptionId, "sub_test_123")

    await processStripeEvent(
      prisma,
      {
        id: "evt_sub_update",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_test_123",
            status: "active",
            cancel_at_period_end: true,
            items: { data: [{ current_period_end: 1_800_000_000 }] },
          },
        },
      } as never,
      notify,
    )
    const updated = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: "sub_test_123" } })
    assert.equal(updated?.cancelAtPeriodEnd, true)
    assert.equal(updated?.currentPeriodEnd?.toISOString(), new Date(1_800_000_000 * 1000).toISOString())
  })

  it("round-trips a snapshot taken from a Stripe-shaped session", async () => {
    const snapshot = snapshotFromSession({
      id: "cs_test_direct",
      mode: "payment",
      payment_status: "paid",
      customer_email: null,
      customer_details: { email: "direct@example.co.nz", name: "Direct" },
      customer: "cus_direct",
      subscription: null,
      payment_intent: "pi_direct",
      currency: "nzd",
      metadata: {
        contactName: "Direct",
        businessName: "Direct Ltd",
        items: JSON.stringify([{ k: "si-complete", n: "SI Complete", c: 899_900, i: "" }]),
      },
    } as never)
    const result = await recordCheckout(prisma, snapshot, async () => ({ status: "logged", provider: "test" }))
    assert.equal(result.recorded, true)
    const purchase = await prisma.purchase.findFirst({ where: { stripeCheckoutSessionId: "cs_test_direct" } })
    assert.equal(purchase?.productKey, "si-complete")
    assert.equal(purchase?.amountExGstCents, 899_900)
  })
})

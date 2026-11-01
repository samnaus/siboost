import type { PublicProduct } from "@/lib/catalog"
import { gstCentsFromExclusive } from "@/lib/money"

export type QuoteLine = {
  key: string
  name: string
  exGstCents: number
  gstCents: number
  incGstCents: number
  interval: "month" | null
  kind: "package" | "subscription"
}

export type CheckoutQuote = {
  lines: QuoteLine[]
  exGstCents: number
  gstCents: number
  incGstCents: number
  recurringExGstCents: number
  mode: "payment" | "subscription"
  agentWarning: string | null
  bundleNote: string | null
}

const AGENT_PACKAGES = new Set(["si-boost", "si-complete"])

export function quoteCheckout(
  input: { packageKey?: string | null; subscriptionKeys: string[] },
  products: PublicProduct[],
  options?: { chargeGst?: boolean },
): { ok: true; quote: CheckoutQuote } | { ok: false; error: string } {
  const gstEnabled = options?.chargeGst ?? true
  const active = products.filter((product) => product.active)
  const byKey = new Map(active.map((product) => [product.key, product]))
  const packageKey = input.packageKey?.trim() || ""
  const subscriptionKeys = [...new Set(input.subscriptionKeys.map((key) => key.trim()).filter(Boolean))]
  const lines: QuoteLine[] = []

  if (packageKey) {
    const product = byKey.get(packageKey)
    if (!product || product.kind !== "package") {
      return { ok: false, error: "Choose a valid package." }
    }
    lines.push(toLine(product, gstEnabled))
  }

  for (const key of subscriptionKeys) {
    const product = byKey.get(key)
    if (!product || product.kind !== "subscription") {
      return { ok: false, error: "One of the subscriptions is not available." }
    }
    lines.push(toLine(product, gstEnabled))
  }

  if (lines.length === 0) {
    return { ok: false, error: "Choose a package, a subscription, or both." }
  }

  const exGstCents = lines.reduce((sum, line) => sum + line.exGstCents, 0)
  const gstCents = lines.reduce((sum, line) => sum + line.gstCents, 0)
  const recurringExGstCents = lines
    .filter((line) => line.interval === "month")
    .reduce((sum, line) => sum + line.exGstCents, 0)
  const needsAgent = lines.some((line) => AGENT_PACKAGES.has(line.key))
  const hasAgent = lines.some((line) => line.key === "si-agent")
  const subscriptionCount = lines.filter((line) => line.interval === "month").length

  return {
    ok: true,
    quote: {
      lines,
      exGstCents,
      gstCents,
      incGstCents: exGstCents + gstCents,
      recurringExGstCents,
      mode: lines.some((line) => line.interval === "month") ? "subscription" : "payment",
      agentWarning:
        needsAgent && !hasAgent
          ? "This package includes assistant setup. The assistant does not stay online unless you add SI Agent, now or later."
          : null,
      bundleNote:
        subscriptionCount > 1
          ? "These subscriptions are billed together. Cancelling that subscription in the billing portal cancels both. Buy them in separate checkouts if you want to cancel them separately."
          : null,
    },
  }
}

function toLine(product: PublicProduct, gstEnabled: boolean): QuoteLine {
  const gstCents = gstCentsFromExclusive(product.priceExGstCents, gstEnabled)
  return {
    key: product.key,
    name: product.name,
    exGstCents: product.priceExGstCents,
    gstCents,
    incGstCents: product.priceExGstCents + gstCents,
    interval: product.interval,
    kind: product.kind,
  }
}

export function compactItems(quote: CheckoutQuote) {
  return JSON.stringify(
    quote.lines.map((line) => ({
      k: line.key,
      n: line.name,
      c: line.exGstCents,
      i: line.interval ?? "",
    })),
  )
}

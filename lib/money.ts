export const GST_RATE = 0.15

export function chargeGst() {
  return process.env.CHARGE_GST !== "false"
}

export function gstCentsFromExclusive(exGstCents: number, enabled = chargeGst()) {
  if (!enabled) return 0
  return Math.round((exGstCents * 15) / 100)
}

export function inclusiveCents(exGstCents: number, enabled = chargeGst()) {
  return exGstCents + gstCentsFromExclusive(exGstCents, enabled)
}

export function formatNzd(cents: number) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(cents / 100)
}

export function formatNzdCompact(cents: number) {
  const amount = cents / 100
  if (Number.isInteger(amount)) {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return formatNzd(cents)
}

export function dollarsToCents(input: string) {
  const trimmed = input.trim().replace(/[$,\s]/g, "")
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null
  const [dollars, fraction = ""] = trimmed.split(".")
  const cents = Number(dollars) * 100 + Number(fraction.padEnd(2, "0"))
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 100_000_000) return null
  return cents
}

export function centsToDollarInput(cents: number) {
  const dollars = Math.trunc(cents / 100)
  const remainder = Math.abs(cents % 100)
  if (remainder === 0) return String(dollars)
  return `${dollars}.${String(remainder).padStart(2, "0")}`
}

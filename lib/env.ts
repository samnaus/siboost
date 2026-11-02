export type PaymentsState = {
  configured: boolean
  mode: "unconfigured" | "test" | "live" | "live_locked"
  message: string | null
}

export function siteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    "http://127.0.0.1:4317",
  ]
  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      return new URL(candidate).origin
    } catch {
      continue
    }
  }
  return "http://127.0.0.1:4317"
}

export function contactEmail() {
  return process.env.CONTACT_EMAIL?.trim() || "hello@siboost.co.nz"
}

export function getPaymentsState(): PaymentsState {
  const key = process.env.STRIPE_SECRET_KEY?.trim() || ""
  if (!key) {
    return {
      configured: false,
      mode: "unconfigured",
      message: "Payments are not yet configured.",
    }
  }
  if (key.startsWith("sk_live_")) {
    if (process.env.ALLOW_LIVE_STRIPE === "true") {
      return { configured: true, mode: "live", message: null }
    }
    return {
      configured: false,
      mode: "live_locked",
      message:
        "Payments are not yet configured. A live Stripe key is present, and live payments stay switched off until ALLOW_LIVE_STRIPE=true.",
    }
  }
  if (key.startsWith("sk_test_")) {
    return {
      configured: true,
      mode: "test",
      message: "Stripe is in test mode. Cards are not charged for real.",
    }
  }
  return {
    configured: false,
    mode: "unconfigured",
    message: "Payments are not yet configured. The Stripe secret key is not a recognised test or live key.",
  }
}

export function webhookConfigured() {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim())
}

export type EmailState = {
  configured: boolean
  provider: "resend" | "postmark" | "console"
}

export function getEmailState(): EmailState {
  if (process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim()) {
    return { configured: true, provider: "resend" }
  }
  if (process.env.POSTMARK_SERVER_TOKEN?.trim() && process.env.EMAIL_FROM?.trim()) {
    return { configured: true, provider: "postmark" }
  }
  return { configured: false, provider: "console" }
}

export function subscriptionsEnabled() {
  return process.env.SUBSCRIPTIONS_ENABLED === "true"
}

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL?.trim() &&
      process.env.ADMIN_PASSWORD?.trim() &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.ADMIN_SESSION_SECRET.length >= 16,
  )
}

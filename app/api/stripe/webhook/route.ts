import { processStripeEvent } from "@/lib/billing"
import { prisma } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { getStripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!stripe || !secret) {
    return Response.json({ error: "Payments are not yet configured." }, { status: 503 })
  }
  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 })
  }
  const body = await request.text()
  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret)
    await processStripeEvent(prisma, event, sendEmail)
    return Response.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed"
    const invalid = message.toLowerCase().includes("signature")
    console.error("[stripe-webhook]", message)
    return Response.json({ error: invalid ? "Invalid signature." : "Webhook processing failed." }, { status: invalid ? 400 : 500 })
  }
}

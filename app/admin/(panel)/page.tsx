import { connection } from "next/server"
import { prisma } from "@/lib/db"
import { adminConfigured, getEmailState, getPaymentsState, webhookConfigured } from "@/lib/env"
import { chargeGst } from "@/lib/money"

export const metadata = { title: "Admin", robots: { index: false, follow: false } }

export default async function AdminHome() {
  await connection()
  const [enquiries, checks, customers, purchases, subscriptions] = await Promise.all([
    prisma.enquiry.count(),
    prisma.readinessCheck.count(),
    prisma.customer.count(),
    prisma.purchase.count(),
    prisma.subscription.count(),
  ])
  const payments = getPaymentsState()
  const email = getEmailState()
  const stats = [
    ["Enquiries", enquiries],
    ["Readiness checks", checks],
    ["Customers", customers],
    ["Purchases", purchases],
    ["Subscriptions", subscriptions],
  ]
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Counts come from this database. Empty numbers mean nothing has been submitted yet. They are not sample data.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-bold">What is connected</h2>
      <ul className="mt-4 space-y-2 text-sm leading-6">
        <li>Admin login: {adminConfigured() ? "configured" : "not configured"}</li>
        <li>Payments: {payments.message || "Live Stripe is enabled."}</li>
        <li>Webhook secret: {webhookConfigured() ? "set" : "not set. Orders can still be recorded from the success page."}</li>
        <li>Email: {email.configured ? `sending with ${email.provider}` : "not configured. Messages are logged in the server console."}</li>
        <li>GST: {chargeGst() ? "15% is added at checkout" : "GST is switched off with CHARGE_GST=false"}</li>
        <li>AI assistant on this website: demonstration only. No provider is connected.</li>
        <li>Readiness check: stores a request for a human review. It does not produce a score.</li>
      </ul>
    </div>
  )
}

import Link from "next/link"
import { Suspense } from "react"
import { connection } from "next/server"
import { recordCheckout, snapshotFromSession } from "@/lib/billing"
import { prisma } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { getPaymentsState } from "@/lib/env"
import { formatNzd } from "@/lib/money"
import { getStripe } from "@/lib/stripe"
import { parseItems } from "@/lib/billing"

export const metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
}

export default function SuccessRoute({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  return (
    <Suspense fallback={<p className="px-6 py-24 text-center">Checking the payment.</p>}>
      <Success searchParams={searchParams} />
    </Suspense>
  )
}

async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  await connection()
  const { session_id: sessionId } = await searchParams
  const payments = getPaymentsState()
  const stripe = getStripe()
  if (!payments.configured || !stripe) {
    return (
      <Message title="Payments are not yet configured.">
        There is no Stripe account connected, so this page cannot confirm a payment.
      </Message>
    )
  }
  if (!sessionId) {
    return <Message title="We could not find that checkout.">Open the link from Stripe again, or contact us with the email you used.</Message>
  }

  const loaded = await loadSuccess(sessionId)
  if (loaded.status === "incomplete") {
    return <Message title="This checkout is not complete.">You can return to the packages page and try again.</Message>
  }
  if (loaded.status === "error") {
    return (
      <Message title="We could not confirm that payment yet.">
        If money left the card, contact us with the email you used at checkout and we will match it.
      </Message>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-sm font-semibold text-[#1d4ed8]">{payments.mode === "test" ? "Stripe test mode" : "Payment"}</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">We have received the order.</h1>
      <p className="mt-4 leading-7 text-slate-600">
        {loaded.paid
          ? "Stripe has confirmed the payment. A confirmation is emailed when email delivery is configured. Until then it is written to the server log."
          : "Stripe has the checkout, and the payment is still processing. We will update the order when it clears."}
      </p>
      {payments.mode === "test" ? (
        <p className="mt-3 text-sm text-blue-900">This was a test payment. No live charge was made.</p>
      ) : null}
      <ul className="mt-6 space-y-2 text-sm">
        {loaded.items.map((item) => (
          <li key={item.k} className="flex justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
            <span>{item.n}</span>
            <span>{formatNzd(item.c)} excl. GST</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-slate-600">
        We will reply to confirm access to the website and the scope. Managing a subscription happens in the billing portal.
      </p>
      <p className="mt-6">
        <Link href="/billing" className="font-semibold text-[#1d4ed8] underline">
          Manage billing
        </Link>
      </p>
    </section>
  )
}

async function loadSuccess(sessionId: string) {
  try {
    const stripe = getStripe()
    if (!stripe) return { status: "error" as const, paid: false, items: [] }
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.status !== "complete") return { status: "incomplete" as const, paid: false, items: [] }
    await recordCheckout(prisma, snapshotFromSession(session), sendEmail)
    return {
      status: "ok" as const,
      paid: session.payment_status === "paid",
      items: parseItems(typeof session.metadata?.items === "string" ? session.metadata.items : undefined),
    }
  } catch (error) {
    console.error("[checkout-success]", error)
    return { status: "error" as const, paid: false, items: [] }
  }
}

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 leading-7 text-slate-600">{children}</p>
    </section>
  )
}

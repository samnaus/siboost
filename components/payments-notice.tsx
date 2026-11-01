import type { PaymentsState } from "@/lib/env"

export function PaymentsNotice({ payments }: { payments: PaymentsState }) {
  if (payments.mode === "live") return null
  const tone =
    payments.mode === "test"
      ? "border-blue-200 bg-blue-50 text-blue-950"
      : "border-amber-200 bg-amber-50 text-amber-950"
  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${tone}`} role="status">
      <strong>{payments.mode === "test" ? "Stripe test mode." : "Payments are not yet configured."}</strong>{" "}
      {payments.mode === "test"
        ? "Cards are not charged for real. Use 4242 4242 4242 4242, any future expiry and any CVC."
        : "You can still send a request and the team will follow it up. Nothing is charged until Stripe is connected."}
    </p>
  )
}

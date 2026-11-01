import { connection } from "next/server"
import { prisma } from "@/lib/db"
import { formatNz } from "@/lib/dates"
import { formatNzd } from "@/lib/money"

export const metadata = { title: "Subscriptions", robots: { index: false, follow: false } }

export default async function SubscriptionsPage() {
  await connection()
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    take: 100,
  })
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p className="mt-4 text-slate-600">No subscriptions yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Monthly excl. GST</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Renews or ends</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-t">
                  <td className="px-3 py-2">{subscription.productName}</td>
                  <td className="px-3 py-2">{subscription.customer.email}</td>
                  <td className="px-3 py-2">{formatNzd(subscription.amountExGstCents)}</td>
                  <td className="px-3 py-2">
                    {subscription.status}
                    {subscription.cancelAtPeriodEnd ? " · cancels at period end" : ""}
                  </td>
                  <td className="px-3 py-2">
                    {subscription.currentPeriodEnd ? formatNz(subscription.currentPeriodEnd) : "Not reported yet"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

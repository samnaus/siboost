import { connection } from "next/server"
import { prisma } from "@/lib/db"
import { formatNz } from "@/lib/dates"

export const metadata = { title: "Customers", robots: { index: false, follow: false } }

export default async function CustomersPage() {
  await connection()
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { purchases: true, subscriptions: true } } },
    take: 100,
  })
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Customers</h1>
      {customers.length === 0 ? (
        <p className="mt-4 text-slate-600">No customers yet. A customer record is created after a Stripe checkout.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2">Business</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Stripe</th>
                <th className="px-3 py-2">Orders</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t">
                  <td className="px-3 py-2">{customer.businessName || customer.name || "—"}</td>
                  <td className="px-3 py-2">{customer.email}</td>
                  <td className="px-3 py-2">{customer.stripeCustomerId ? "Linked" : "—"}</td>
                  <td className="px-3 py-2">
                    {customer._count.purchases} purchases, {customer._count.subscriptions} subscriptions
                  </td>
                  <td className="px-3 py-2">{formatNz(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

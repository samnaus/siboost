import { connection } from "next/server"
import { prisma } from "@/lib/db"
import { formatNz } from "@/lib/dates"
import { formatNzd } from "@/lib/money"

export const metadata = { title: "Purchases", robots: { index: false, follow: false } }

export default async function PurchasesPage() {
  await connection()
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    take: 100,
  })
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Purchases</h1>
      <p className="mt-2 text-sm text-slate-600">One-off packages only. Card numbers are not stored.</p>
      {purchases.length === 0 ? (
        <p className="mt-4 text-slate-600">No purchases yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Excl. GST</th>
                <th className="px-3 py-2">Incl. GST</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-t">
                  <td className="px-3 py-2">{purchase.productName}</td>
                  <td className="px-3 py-2">{purchase.customer.email}</td>
                  <td className="px-3 py-2">{formatNzd(purchase.amountExGstCents)}</td>
                  <td className="px-3 py-2">{formatNzd(purchase.amountIncGstCents)}</td>
                  <td className="px-3 py-2">{purchase.status}</td>
                  <td className="px-3 py-2">{formatNz(purchase.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

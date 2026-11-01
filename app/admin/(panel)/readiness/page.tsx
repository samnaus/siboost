import { connection } from "next/server"
import { updateReadiness } from "@/app/actions/admin"
import { prisma } from "@/lib/db"
import { formatNz } from "@/lib/dates"

export const metadata = { title: "Readiness checks", robots: { index: false, follow: false } }

export default async function ReadinessAdminPage() {
  await connection()
  const checks = await prisma.readinessCheck.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Readiness checks</h1>
      <p className="mt-2 text-sm text-slate-600">These are requests for a human review. There is no generated score.</p>
      {checks.length === 0 ? (
        <p className="mt-4 text-slate-600">No readiness checks yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {checks.map((check) => (
            <article key={check.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
              <h2 className="text-base font-bold">{check.businessName}</h2>
              <p className="mt-1">
                <a className="text-[#1d4ed8] underline" href={check.websiteUrl}>
                  {check.websiteUrl}
                </a>
              </p>
              <p className="mt-1">
                {check.contactName} · {check.email}
              </p>
              <p className="mt-1 text-slate-500">{formatNz(check.createdAt)}</p>
              <form action={updateReadiness} className="mt-3 grid gap-2">
                <input type="hidden" name="id" value={check.id} />
                <label htmlFor={`r-${check.id}`}>Status</label>
                <select id={`r-${check.id}`} name="status" defaultValue={check.status} className="h-10 rounded-lg border px-3">
                  <option value="received">Received</option>
                  <option value="in_review">In review</option>
                  <option value="closed">Closed</option>
                </select>
                <label htmlFor={`rn-${check.id}`}>Internal notes</label>
                <textarea id={`rn-${check.id}`} name="notes" defaultValue={check.notes ?? ""} rows={3} className="rounded-lg border px-3 py-2" />
                <button type="submit" className="h-10 w-fit rounded-full bg-[#2563eb] px-4 font-semibold text-white">
                  Save
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

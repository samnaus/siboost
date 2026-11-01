import { connection } from "next/server"
import { updateEnquiry } from "@/app/actions/admin"
import { prisma } from "@/lib/db"
import { formatNz } from "@/lib/dates"

export const metadata = { title: "Enquiries", robots: { index: false, follow: false } }

export default async function EnquiriesPage() {
  await connection()
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="mt-4 text-slate-600">No enquiries yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {enquiries.map((enquiry) => (
            <details key={enquiry.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold">
                {enquiry.businessName || enquiry.name} · {enquiry.type} · {enquiry.status}
              </summary>
              <dl className="mt-4 grid gap-2 text-sm">
                <div>Name: {enquiry.name}</div>
                <div>Email: {enquiry.email}</div>
                <div>Phone: {enquiry.phone || "—"}</div>
                <div>Website: {enquiry.websiteUrl || "—"}</div>
                <div>Package: {enquiry.packageInterest || "—"}</div>
                <div>Subscriptions: {enquiry.subscriptionInterest || "—"}</div>
                <div>Received: {formatNz(enquiry.createdAt)}</div>
              </dl>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{enquiry.message}</p>
              <form action={updateEnquiry} className="mt-4 grid gap-2">
                <input type="hidden" name="id" value={enquiry.id} />
                <label className="text-sm font-medium" htmlFor={`status-${enquiry.id}`}>
                  Status
                </label>
                <select id={`status-${enquiry.id}`} name="status" defaultValue={enquiry.status} className="h-10 rounded-lg border px-3">
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="closed">Closed</option>
                </select>
                <label className="text-sm font-medium" htmlFor={`notes-${enquiry.id}`}>
                  Internal notes
                </label>
                <textarea id={`notes-${enquiry.id}`} name="notes" defaultValue={enquiry.notes ?? ""} rows={3} className="rounded-lg border px-3 py-2" />
                <button type="submit" className="h-10 w-fit rounded-full bg-[#2563eb] px-4 text-sm font-semibold text-white">
                  Save
                </button>
              </form>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}

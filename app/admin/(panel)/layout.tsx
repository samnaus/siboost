import Link from "next/link"
import { Suspense } from "react"
import { connection } from "next/server"
import { redirect } from "next/navigation"
import { logoutAdmin } from "@/app/actions/admin"
import { getAdminSession } from "@/lib/auth"
import { Wordmark } from "@/components/wordmark"

const links = [
  ["/admin", "Overview"],
  ["/admin/enquiries", "Enquiries"],
  ["/admin/readiness", "Readiness checks"],
  ["/admin/customers", "Customers"],
  ["/admin/purchases", "Purchases"],
  ["/admin/subscriptions", "Subscriptions"],
  ["/admin/products", "Products and prices"],
  ["/admin/content", "Content"],
]

export default function PanelRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-6 py-20">Loading admin.</p>}>
      <Panel>{children}</Panel>
    </Suspense>
  )
}

async function Panel({ children }: { children: React.ReactNode }) {
  await connection()
  const email = await getAdminSession()
  if (!email) redirect("/admin/login")
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[220px_1fr] md:px-8">
        <aside>
          <Link href="/" aria-label="View the website">
            <Wordmark />
          </Link>
          <p className="mt-3 text-xs text-slate-500">{email}</p>
          <nav aria-label="Admin" className="mt-6 grid gap-1">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
                {label}
              </Link>
            ))}
          </nav>
          <form action={logoutAdmin} className="mt-6">
            <button type="submit" className="text-sm font-semibold text-[#1d4ed8]">
              Sign out
            </button>
          </form>
        </aside>
        <main id="main">{children}</main>
      </div>
    </div>
  )
}

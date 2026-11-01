import { Suspense } from "react"
import { connection } from "next/server"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Wordmark } from "@/components/wordmark"
import { getAdminSession } from "@/lib/auth"
import { adminConfigured } from "@/lib/env"

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } }

export default function LoginRoute() {
  return (
    <Suspense fallback={<p className="px-6 py-20 text-center">Loading.</p>}>
      <LoginPage />
    </Suspense>
  )
}

async function LoginPage() {
  await connection()
  const session = await getAdminSession()
  if (session) redirect("/admin")
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <Wordmark />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Private area for enquiries, orders and editable prices. Not indexed.
      </p>
      {adminConfigured() ? null : (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Admin access is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET.
        </p>
      )}
      <div className="mt-6">
        <LoginForm />
      </div>
    </main>
  )
}

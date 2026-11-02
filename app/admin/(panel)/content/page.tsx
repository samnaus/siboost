import { connection } from "next/server"
import { ContentEditor } from "@/components/admin-editors"
import { getSiteContent } from "@/lib/content/get-content"
import { subscriptionsEnabled } from "@/lib/env"

export const metadata = { title: "Content", robots: { index: false, follow: false } }

export default async function ContentAdminPage() {
  await connection()
  const content = await getSiteContent()
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Content</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        These fields cover the homepage headline, contact details, about copy, the readiness introduction and FAQs. Package features and prices are edited under Products. Longer page copy that is not listed here lives in the content defaults file. AI sales agents are not editable here because they are not on the public site.
      </p>
      <div className="mt-6">
        <ContentEditor content={content} subscriptionsOff={!subscriptionsEnabled()} />
      </div>
    </div>
  )
}

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getSiteContent } from "@/lib/content/get-content"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent()
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter content={content} />
    </>
  )
}

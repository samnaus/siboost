import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import type { SiteContent } from "@/lib/content/types"

const columns = [
  {
    title: "Explore",
    links: [
      ["/packages", "Packages and pricing"],
      ["/ai-sales-agents", "AI sales agents"],
      ["/ai-search-readiness", "AI search readiness"],
      ["/how-it-works", "How it works"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/about", "About Siboost"],
      ["/contact", "Contact"],
      ["/check", "Website readiness check"],
      ["/billing", "Manage billing"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/privacy", "Privacy policy"],
      ["/terms", "Terms of service"],
      ["/llms.txt", "llms.txt"],
    ],
  },
] as const

export function SiteFooter({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t border-slate-200 bg-[#0f172a] text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">{content.business.tagline}</p>
          <p className="mt-4 text-sm">
            <a className="font-semibold text-white underline-offset-4 hover:underline" href={`mailto:${content.business.email}`}>
              {content.business.email}
            </a>
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-2">
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-300 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm text-slate-400 md:px-8">
          © 2026 Siboost. New Zealand. Prices are in NZD and exclude GST.
        </p>
      </div>
    </footer>
  )
}

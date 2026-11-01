"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useState } from "react"
import { Menu, X } from "lucide-react"
import { Wordmark } from "@/components/wordmark"
import { CtaLink } from "@/components/cta-link"

const links = [
  { href: "/packages", label: "Packages" },
  { href: "/ai-sales-agents", label: "AI Sales Agents" },
  { href: "/ai-search-readiness", label: "AI Search Readiness" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null)
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" aria-label="Siboost home" className="rounded-md">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="text-sm font-semibold text-slate-700 hover:text-[#0f172a] aria-[current=page]:text-[#1d4ed8]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink href="/check" className="hidden sm:inline-flex">
            Check My Website
          </CtaLink>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <div id={menuId} role="dialog" aria-modal="true" aria-label="Menu" className="border-t border-slate-200 bg-white lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="rounded-xl px-3 py-3 text-base font-semibold text-[#0f172a] hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <CtaLink href="/check" className="mt-2">
              Check My Website
            </CtaLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

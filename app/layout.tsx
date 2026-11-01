import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import Script from "next/script"
import { JsonLd } from "@/components/json-ld"
import { getSiteContent } from "@/lib/content/get-content"
import { siteUrl } from "@/lib/env"
import { organizationJsonLd, websiteJsonLd } from "@/lib/schema"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Siboost",
    template: "%s | Siboost",
  },
  description: "Siboost upgrades New Zealand business websites for the way people search now.",
  applicationName: "Siboost",
  authors: [{ name: "Siboost" }],
  creator: "Siboost",
  category: "technology",
  openGraph: { type: "website", locale: "en_NZ", siteName: "Siboost" },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getSiteContent()
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="en-NZ" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#0f172a]">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd(content)} />
        <JsonLd data={websiteJsonLd(content)} />
        {children}
        {plausible && /^[a-z0-9.-]+$/i.test(plausible) ? (
          <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" />
        ) : null}
        {ga && /^G-[A-Z0-9]+$/i.test(ga) ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
            <Script id="ga4">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}</Script>
          </>
        ) : null}
      </body>
    </html>
  )
}

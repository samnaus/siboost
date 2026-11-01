import { CtaLink } from "@/components/cta-link"

export const metadata = { title: "Request received", robots: { index: false, follow: false } }

export default function ReceivedPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-sm font-semibold text-amber-800">Payments are not yet configured.</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">We have saved this as an enquiry.</h1>
      <p className="mt-4 leading-7 text-slate-600">
        Online card payments are not connected yet, or checkout could not be started. Nothing has been charged. A person at Siboost will reply about the package or subscription you selected.
      </p>
      <div className="mt-8">
        <CtaLink href="/">Back to the homepage</CtaLink>
      </div>
    </section>
  )
}

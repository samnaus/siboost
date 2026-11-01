import { CtaLink } from "@/components/cta-link"

export const metadata = { title: "Checkout cancelled", robots: { index: false, follow: false } }

export default function CancelledPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Checkout cancelled.</h1>
      <p className="mt-4 leading-7 text-slate-600">
        No payment was taken. You can choose a package again, or send a message if you would rather talk it through first.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <CtaLink href="/packages">Back to packages</CtaLink>
        <CtaLink href="/contact" variant="secondary">
          Contact us
        </CtaLink>
      </div>
    </section>
  )
}

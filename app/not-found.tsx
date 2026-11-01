import Link from "next/link"
import { Wordmark } from "@/components/wordmark"

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-20">
      <Link href="/" aria-label="Siboost home">
        <Wordmark />
      </Link>
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight">That page is not here.</h1>
      <p className="mt-3 leading-7 text-slate-600">The address may have changed. The packages page and the contact form are the useful places to go next.</p>
      <p className="mt-6 flex gap-4 text-sm font-semibold">
        <Link href="/packages" className="text-[#1d4ed8] underline">
          Packages
        </Link>
        <Link href="/contact" className="text-[#1d4ed8] underline">
          Contact
        </Link>
      </p>
    </main>
  )
}

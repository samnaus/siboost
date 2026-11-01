"use client"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5">
      <h1 className="text-4xl font-extrabold tracking-tight">Something went wrong.</h1>
      <p className="mt-3 leading-7 text-slate-600">
        Please try again. If it continues, use the contact form once the page is back.
      </p>
      <button type="button" onClick={reset} className="mt-6 h-11 w-fit rounded-full bg-[#2563eb] px-5 font-semibold text-white">
        Try again
      </button>
    </main>
  )
}

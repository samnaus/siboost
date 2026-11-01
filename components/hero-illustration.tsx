export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-300" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-slate-800">Illustration</span>
        </div>
        <p className="mt-5 text-xs font-semibold tracking-wide text-[#1d4ed8] uppercase">A customer asks</p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-[#0f172a]">
          Who can help me plan a new home in Canterbury?
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-600">
          Illustration only. Not a live AI result, and not a promise of being recommended.
        </p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-[#0f172a]">What a clear website gives an assistant to work with</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>Services and service area, written in plain language</li>
            <li>Structured business details a crawler can read</li>
            <li>A visible way to enquire or book</li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg lg:-mt-3 lg:ml-10 lg:w-80">
        <p className="text-xs font-semibold text-slate-600">On-site assistant · illustration</p>
        <div className="mt-3 space-y-2 text-sm">
          <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[#2563eb] px-3 py-2 text-white">
            Can you help me book a site visit?
          </p>
          <p className="max-w-[95%] rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-slate-800">
            I can take a preferred day and your contact details, then pass them to the team.
          </p>
        </div>
      </div>
    </div>
  )
}

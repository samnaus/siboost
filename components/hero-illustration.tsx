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
        <p className="mt-5 text-xs font-semibold tracking-wide text-[#1d4ed8] uppercase">A customer searches</p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-[#0f172a]">
          Who can help me plan a new home in Canterbury?
        </p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-[#0f172a]">What a clear website makes visible</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>Services and service area, written in plain language</li>
            <li>Structured business details a crawler can read</li>
            <li>A visible way to enquire</li>
          </ul>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {["Home", "Services", "Service area", "Contact"].map((label) => (
            <p key={label} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-[#0f172a]">
              {label}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

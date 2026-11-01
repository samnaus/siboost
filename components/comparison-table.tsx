import type { ComparisonRow } from "@/lib/content/types"

export function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <caption className="sr-only">Comparison of SI Ready, SI Boost and SI Complete</caption>
        <thead className="bg-slate-50 text-left">
          <tr>
            <th scope="col" className="sticky left-0 bg-slate-50 px-4 py-3 font-semibold text-[#0f172a]">
              Included work
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[#0f172a]">SI Ready</th>
            <th scope="col" className="px-4 py-3 font-semibold text-[#1d4ed8]">SI Boost</th>
            <th scope="col" className="px-4 py-3 font-semibold text-[#0f172a]">SI Complete</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-t border-slate-200">
              <th scope="row" className="sticky left-0 bg-white px-4 py-3 text-left font-medium text-[#0f172a]">
                {row.feature}
              </th>
              <td className="px-4 py-3 text-slate-700">{row.ready}</td>
              <td className="bg-blue-50/40 px-4 py-3 text-slate-800">{row.boost}</td>
              <td className="px-4 py-3 text-slate-700">{row.complete}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

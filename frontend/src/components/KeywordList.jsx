export default function KeywordList({ matched = [], missing = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="font-semibold text-good mb-3">
          Matched Keywords ({matched.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {matched.length === 0 && (
            <p className="text-sm text-slate-500">No keyword matches found.</p>
          )}
          {matched.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2.5 py-1 rounded-full bg-good/10 text-good border border-good/30"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="font-semibold text-bad mb-3">
          Missing Keywords ({missing.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {missing.length === 0 && (
            <p className="text-sm text-slate-500">Great — no major gaps found!</p>
          )}
          {missing.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2.5 py-1 rounded-full bg-bad/10 text-bad border border-bad/30"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

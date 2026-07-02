function scoreColor(score) {
  if (score >= 75) return "text-good";
  if (score >= 50) return "text-warn";
  return "text-bad";
}
function ringColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}
export default function ScoreCard({ result }) {
  const { atsScore, keywordScore, formatScore, sectionScore, semanticScore } = result;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (atsScore / 100) * circumference;

  const breakdown = [
    { label: "Keyword Match", value: keywordScore },
    { label: "Semantic Relevance", value: semanticScore },
    { label: "Section Coverage", value: sectionScore },
    { label: "Format Quality", value: formatScore },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
      <div className="relative w-40 h-40 shrink-0">
        <svg width="160" height="160" className="-rotate-90">
          <circle cx="80" cy="80" r="54" stroke="#1e293b" strokeWidth="12" fill="none" />
          <circle
            cx="80"
            cy="80"
            r="54"
            stroke={ringColor(atsScore)}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor(atsScore)}`}>{atsScore}</span>
          <span className="text-xs text-slate-400">ATS Score</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-3">
        {breakdown.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{b.label}</span>
              <span className={scoreColor(b.value)}>{b.value}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${b.value}%`, backgroundColor: ringColor(b.value) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

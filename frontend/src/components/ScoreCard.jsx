import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Target, Sparkles, ListChecks, LayoutTemplate } from "lucide-react";

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

const METRIC_ICONS = {
  "Keyword Match": Target,
  "Semantic Relevance": Sparkles,
  "Section Coverage": ListChecks,
  "Format Quality": LayoutTemplate,
};

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

  const radarData = breakdown.map((b) => ({
    metric: b.label.split(" ")[0],
    score: b.value,
    fullMark: 100,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Circular score gauge */}
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

        {/* Breakdown bars with icons */}
        <div className="flex-1 w-full space-y-3">
          {breakdown.map((b) => {
            const Icon = METRIC_ICONS[b.label];
            return (
              <div key={b.label}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Icon size={14} className="text-slate-500" />
                    {b.label}
                  </span>
                  <span className={scoreColor(b.value)}>{b.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${b.value}%`, backgroundColor: ringColor(b.value) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar chart visualization */}
      <div className="pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
          <Sparkles size={12} /> Score shape at a glance
        </p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <Radar
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Eye, Trash2, FileSearch, FileText } from "lucide-react";

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

export default function HistoryList({ items = [], onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <FileSearch size={28} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No analyses yet</p>
        <p className="text-slate-600 text-sm mt-1">Run your first scan to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const circumference = 2 * Math.PI * 16;
        const offset = circumference - (item.atsScore / 100) * circumference;
        return (
          <div
            key={item._id}
            className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 sm:px-5 py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-slate-500" />
              </span>
              <div className="min-w-0">
                <p className="font-medium truncate">{item.jobTitle}</p>
                <p className="text-xs text-slate-500 truncate">
                  {item.fileName} • {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-9 h-9">
                <svg width="36" height="36" className="-rotate-90">
                  <circle cx="18" cy="18" r="16" stroke="#1e293b" strokeWidth="3" fill="none" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    stroke={ringColor(item.atsScore)}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${scoreColor(
                    item.atsScore
                  )}`}
                >
                  {item.atsScore}
                </span>
              </div>
              <Link
                to={`/history/${item._id}`}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                title="View"
              >
                <Eye size={15} />
              </Link>
              <button
                onClick={() => onDelete(item._id)}
                className="p-2 rounded-lg bg-bad/10 text-bad hover:bg-bad/20 transition"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

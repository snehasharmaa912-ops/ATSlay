import { Link } from "react-router-dom";
function scoreColor(score) {
  if (score >= 75) return "text-good";
  if (score >= 50) return "text-warn";
  return "text-bad";
}
export default function HistoryList({ items = [], onDelete }) {
  if (items.length === 0) {
    return <p className="text-slate-500 text-sm">No analyses yet. Run your first scan!</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-4"
        >
          <div>
            <p className="font-medium">{item.jobTitle}</p>
            <p className="text-xs text-slate-500">
              {item.fileName} • {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-bold text-lg ${scoreColor(item.atsScore)}`}>
              {item.atsScore}
            </span>
            <Link
              to={`/history/${item._id}`}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              View
            </Link>
            <button
              onClick={() => onDelete(item._id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-bad/10 text-bad hover:bg-bad/20"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

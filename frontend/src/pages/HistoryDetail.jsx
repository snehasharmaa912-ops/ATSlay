import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import api from "../api/axios";
import ScoreCard from "../components/ScoreCard";
import KeywordList from "../components/KeywordList";
import { downloadAnalysisReport } from "../utils/generateReport";

export default function HistoryDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => {
    api.get(`/resume/${id}`).then(({ data }) => setItem(data));
  }, [id]);

  if (!item) return <p className="text-center mt-20 text-slate-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{item.jobTitle}</h1>
          <p className="text-slate-500 text-sm">
            {item.fileName} • {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() =>
            downloadAnalysisReport(item, {
              jobTitle: item.jobTitle,
              fileName: item.fileName,
              createdAt: item.createdAt,
            })
          }
          className="shrink-0 flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent transition"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>
      <ScoreCard result={item} />
      <KeywordList matched={item.matchedKeywords} missing={item.missingKeywords} />
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Suggestions</h3>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-300">
          {item.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

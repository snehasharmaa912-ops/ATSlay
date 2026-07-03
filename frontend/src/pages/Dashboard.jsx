import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, AlertCircle } from "lucide-react";
import api from "../api/axios";
import UploadForm from "../components/UploadForm";
import ScoreCard from "../components/ScoreCard";
import KeywordList from "../components/KeywordList";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async ({ file, jobTitle, jobDescription }) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", jobDescription);

      const { data } = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analyze your resume</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload your resume and a job description to get an instant ATS compatibility score.
        </p>
      </div>

      <UploadForm onAnalyze={handleAnalyze} loading={loading} />

      {error && (
        <div className="bg-bad/10 border border-bad/30 text-bad rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <ScoreCard result={result} />
          <KeywordList matched={result.matchedKeywords} missing={result.missingKeywords} />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="font-semibold mb-3">Sections Detected</h3>
              <div className="flex flex-wrap gap-2">
                {result.detectedSections.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-good/10 text-good border border-good/30"
                  >
                    <CheckCircle2 size={12} />
                    {s}
                  </span>
                ))}
                {result.missingSections.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-bad/10 text-bad border border-bad/30"
                  >
                    <XCircle size={12} />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-1.5">
                <Lightbulb size={16} className="text-warn" />
                Suggestions
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }

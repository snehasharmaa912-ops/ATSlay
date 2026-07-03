import { Link } from "react-router-dom";
import {
  ScanSearch,
  Sparkles,
  ListChecks,
  LayoutTemplate,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "TF-IDF Keyword Extraction",
    desc: "Pulls the most important terms straight from the job description, not a hardcoded list.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Sparkles,
    title: "Semantic Similarity",
    desc: "Cosine-similarity scoring so wording differences don't tank your score.",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
  },
  {
    icon: ListChecks,
    title: "Section Detection",
    desc: "Flags missing Education, Skills, Projects, or Experience sections.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: LayoutTemplate,
    title: "Format Audit",
    desc: "Checks bullet points, contact info, action verbs, and layout issues.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Ambient gradient glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[120px]" />
        <div className="absolute top-40 -right-32 w-[28rem] h-[28rem] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6">
            <Zap size={12} className="fill-accent" />
            Real NLP, not a keyword list
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Beat the bots.{" "}
            <span className="bg-gradient-to-r from-accent via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Land the interview.
            </span>
          </h1>
          <p className="text-slate-400 mt-5 text-lg leading-relaxed">
            ATSlay scores your resume against any job description in real time using NLP —
            keyword matching, semantic relevance, formatting, and section coverage — so you
            know exactly what to fix before you hit submit.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-indigo-500 font-semibold transition shadow-lg shadow-accent/25"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
            </Link>
          </div>
        </div>

        {/* Visual score-card mockup */}
        <div className="mt-20 mx-auto max-w-xl">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg width="112" height="112" className="-rotate-90">
                  <circle cx="56" cy="56" r="46" stroke="#1e293b" strokeWidth="10" fill="none" />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#22c55e"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * 0.15}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-good">85</span>
                  <span className="text-[10px] text-slate-500">ATS Score</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-good shrink-0" />
                  <span className="text-slate-300">React, Node.js, MongoDB matched</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-good shrink-0" />
                  <span className="text-slate-300">All key sections detected</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle size={16} className="text-bad shrink-0" />
                  <span className="text-slate-300">Missing: AWS, cloud platforms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="group bg-slate-900 border border-slate-800 rounded-xl p-5 text-left hover:border-slate-700 transition"
            >
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

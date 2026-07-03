
import { Link } from "react-router-dom";
import {
  ScanSearch,
  Sparkles,
  ListChecks,
  LayoutTemplate,
  ArrowRight,
  UploadCloud,
  BrainCircuit,
  ClipboardCheck,
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

const STEPS = [
  {
    icon: UploadCloud,
    step: "01",
    title: "Upload & Paste",
    desc: "Drop your resume (PDF/DOCX) and paste the job description you're targeting.",
  },
  {
    icon: BrainCircuit,
    step: "02",
    title: "NLP Does the Work",
    desc: "TF-IDF extracts key terms, stemming normalizes them, cosine similarity measures relevance.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Get Your Breakdown",
    desc: "See your score, matched/missing keywords, and specific fixes — in under 2 seconds.",
  },
];

const TECH = [
  "React", "Node.js", "Express", "MongoDB", "TF-IDF", "Cosine Similarity", "JWT Auth", "Tailwind CSS",
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-grid">
        <div className="animate-blob absolute -top-40 -left-32 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[120px]" />
        <div className="animate-blob-delay absolute top-40 -right-32 w-[28rem] h-[28rem] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
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

        {/* Tech stack strip */}
        <div className="mt-16 flex flex-wrap justify-center gap-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {TECH.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div
              key={title}
              className="animate-fade-in-up group bg-slate-900 border border-slate-800 rounded-xl p-5 text-left hover:border-slate-700 hover:-translate-y-0.5 transition-all"
              style={{ animationDelay: `${0.15 + i * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-center mb-2">How it works</h2>
          <p className="text-slate-500 text-center text-sm mb-10">
            Three steps, no manual keyword guessing required.
          </p>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            {STEPS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="relative z-10 w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <Icon size={26} className="text-accent" />
                </div>
                <span className="text-xs font-mono text-slate-600">{step}</span>
                <h3 className="font-semibold mt-1 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed px-4">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-2">Ready to see your score?</h2>
          <p className="text-slate-400 text-sm mb-6">Free, instant, and it takes less than a minute.</p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-indigo-500 font-semibold transition shadow-lg shadow-accent/25"
          >
            {user ? "Go to Dashboard" : "Analyze My Resume"}
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Beat the bots. <span className="text-accent">Land the interview.</span>
      </h1>
      <p className="text-slate-400 mt-4 text-lg">
        ATSlay scores your resume against any job description in real time using NLP —
        keyword matching, semantic relevance, formatting, and section coverage — so you
        know exactly what to fix before you hit submit.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to={user ? "/dashboard" : "/register"}
          className="px-6 py-3 rounded-xl bg-accent hover:bg-indigo-500 font-semibold"
        >
          {user ? "Go to Dashboard" : "Get Started Free"}
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-16 text-left">
        {[
          ["TF-IDF Keyword Extraction", "Pulls the most important terms straight from the job description."],
          ["Semantic Similarity", "Cosine-similarity scoring so wording differences don't tank your score."],
          ["Section Detection", "Flags missing Education, Skills, Projects, or Experience sections."],
          ["Format Audit", "Checks bullet points, contact info, action verbs, and layout issues."],
        ].map(([title, desc]) => (
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Camera, Briefcase, Mail, Target } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
              <Target size={14} className="text-accent" />
            </span>
            <span className="font-semibold text-sm">
              ATS<span className="text-accent">lay</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:sharmasnehaa08@gmail.com"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent transition"
              title="Email"
            >
              <Mail size={15} />
            </a>
            <a
              href="https://www.instagram.com/_snehasharma_._?igsh=bGF6eGoxcGUxMmVv"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent transition"
              title="Instagram"
            >
              <Camera size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/snehasharmaa2006"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent transition"
              title="LinkedIn"
            >
              <Briefcase size={15} />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600 text-center">
          <p>
            Built by <span className="text-slate-400 font-medium">Sneha Sharma</span>{" "}
            · <a href="mailto:sharmasnehaa08@gmail.com" className="hover:text-accent transition">sharmasnehaa08@gmail.com</a>
          </p>
          <p>© {new Date().getFullYear()} ATSlay. MIT Licensed.</p>
        </div>
      </div>
    </footer>
  );
}

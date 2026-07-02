import { useState } from "react";
export default function UploadForm({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "doc"].includes(ext)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }
    setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please attach your resume.");
    if (jobDescription.trim().length < 20)
      return alert("Paste a job description (at least 20 characters).");
    onAnalyze({ file, jobTitle, jobDescription });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
          dragActive ? "border-accent bg-accent/5" : "border-slate-700"
        }`}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <label htmlFor="resume-upload" className="cursor-pointer">
          <p className="font-medium">
            {file ? file.name : "Drag & drop your resume, or tap to browse"}
          </p>
          <p className="text-sm text-slate-500 mt-1">PDF or DOCX, max 5MB</p>
        </label>
      </div>

      <input
        type="text"
        placeholder="Job title (optional) — e.g. SDE Intern at Google"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
      />

      <textarea
        placeholder="Paste the full job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-accent hover:bg-indigo-500 transition font-semibold disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
}

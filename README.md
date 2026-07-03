# ATSlay 🎯

**AI-powered ATS Resume Analyzer** — upload a resume, paste a job description, and get an instant compatibility score powered by real NLP (TF-IDF keyword extraction, cosine similarity, stemming, section/format auditing).

🔗 **Live demo:** [https://at-slay.vercel.app](https://at-slay.vercel.app)

## Why this is more than a keyword matcher

Most "ATS checkers" just do a naive string search. ATSlay instead:

- **Extracts the most important terms from the JD itself** using TF-IDF, instead of a hardcoded keyword list.
- **Stems words before matching** (Porter Stemmer) — so "managing", "managed", and "management" all count as a match for "manage".
- **Computes semantic similarity** between resume and JD using cosine similarity over term-frequency vectors, catching relevance even when exact words differ.
- **Audits formatting** — bullet usage, contact info presence, action verbs, resume length, multi-column layout risk (a real cause of ATS parsing failures).
- **Detects resume sections** (Education, Experience, Projects, Skills, etc.) via pattern matching and flags what's missing.
- Combines all four signals into a single weighted **ATS Score** with a full breakdown, not just one number.

## Known Limitations

Being upfront about what this doesn't handle perfectly:

- **PDF text extraction isn't perfect.** `pdf-parse` reads embedded text layers, so it can misread multi-column layouts (text order gets jumbled), fail on scanned/image-based PDFs (no OCR is performed), and occasionally merge or drop characters from resumes with unusual fonts or heavy graphic design.
- **DOCX parsing via `mammoth` extracts raw text only** — tables, text boxes, and embedded images/graphics are stripped, which is actually representative of how most real ATS systems behave, but worth knowing.
- **TF-IDF keyword extraction is frequency-based, not truly semantic** — it can occasionally surface generic terms as "important" if a JD is short or repetitive, and it has no concept of synonyms outside of stemming (e.g., it won't connect "led a team" with "team leadership" the way a large language model might).
- **Section detection relies on regex pattern matching** against common header phrasing — a resume using unconventional section titles (e.g., "My Journey" instead of "Experience") may be flagged as missing a section it actually has.

These are solvable with more advanced NLP (embeddings, OCR fallback, LLM-based extraction) — documented here as a deliberate scope decision for a v1, not an oversight.
## Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend    | Node.js, Express, JWT auth, Multer |
| Database   | MongoDB + Mongoose |
| NLP        | `natural` (TF-IDF, Porter stemming), `stopword`, custom cosine-similarity + scoring engine |
| Parsing    | `pdf-parse` (PDF), `mammoth` (DOCX) |
| Hosting    | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Features

- 🔐 JWT-based auth (register/login)
- 📄 Upload resume as PDF or DOCX, drag-and-drop supported
- 📊 Real-time ATS score with keyword / semantic / section / format breakdown
- 🟢🔴 Matched vs. missing keyword chips
- 🧭 Section coverage detection (Education, Skills, Projects, etc.)
- 💡 Actionable, specific suggestions to improve the resume
- 🕘 Analysis history per user, with the ability to revisit or delete past scans

## Project Structure

ATSlay/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # auth + resume analysis logic
│   ├── middleware/        # JWT auth, multer upload, error handler
│   ├── models/            # User, Resume (Mongoose schemas)
│   ├── routes/            # /api/auth, /api/resume
│   ├── utils/
│   │   ├── parseResume.js # PDF/DOCX text extraction
│   │   └── nlpScorer.js   # TF-IDF, cosine similarity, scoring engine
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── components/    # Navbar, UploadForm, ScoreCard, KeywordList, HistoryList
        ├── context/AuthContext.jsx
        └── pages/         # Home, Login, Register, Dashboard, History, HistoryDetail

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local MongoDB or a free MongoDB Atlas cluster)

### 1. Backend setup

cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI + JWT_SECRET
npm run dev

Backend runs at http://localhost:5000.

### 2. Frontend setup

cd frontend
npm install
cp .env.example .env
npm run dev

Frontend runs at http://localhost:5173.

### 3. Try it out
1. Register an account.
2. Go to Dashboard → upload a resume (PDF/DOCX) → paste a job description.
3. Click **Analyze Resume** and review your score breakdown, matched/missing keywords, and suggestions.

## How the ATS Score is calculated

ATS Score = (Keyword Match × 40%) + (Semantic Similarity × 25%)
          + (Section Coverage × 15%) + (Format Quality × 20%)

- **Keyword Match** — % of top TF-IDF terms from the JD found (after stemming) in the resume.
- **Semantic Similarity** — cosine similarity between resume and JD term-frequency vectors.
- **Section Coverage** — % of expected resume sections detected.
- **Format Quality** — deductions for missing contact info, too few bullet points/action verbs, poor length, or table-based layouts that break ATS parsers.

Built with ❤️ in Dehradun

**Sneha Sharma**
📧 snehasharmaa912@gmail.com
📸 [Instagram](https://www.instagram.com/_snehasharma_._?igsh=bGF6eGoxcGUxMmVv)
💼 [LinkedIn](https://www.linkedin.com/in/snehasharmaa2006)

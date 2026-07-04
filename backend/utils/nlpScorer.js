  const natural = require("natural");
const sw = require("stopword");
const { normalizeSynonym } = require("./synonyms");
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const SECTION_PATTERNS = {
  "Contact Info": /(email|phone|linkedin|github|contact)/i,
  Summary: /(summary|objective|profile)/i,
  Education: /(education|academic|b\.?tech|university|college)/i,
  Experience: /(experience|internship|work history|employment)/i,
  Projects: /(projects?)/i,
  Skills: /(skills?|technologies|tech stack)/i,
  Achievements: /(achievements?|awards?|certifications?|accomplishments?)/i,
};

const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "created", "led", "managed",
  "optimized", "automated", "engineered", "launched", "improved", "reduced",
  "increased", "architected", "deployed", "integrated", "streamlined", "spearheaded",
];

function cleanAndTokenize(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const withoutStopwords = sw.removeStopwords(tokens);
  return withoutStopwords.filter((t) => t.length > 1 && /^[a-z0-9+#.]+$/i.test(t));
}

function stemTokens(tokens) {
  return tokens.map((t) => stemmer.stem(normalizeSynonym(t)));
}
function buildBigrams(tokens) {
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
  }
  return bigrams;
}

function displayPhrase(term) {
  return term.includes("_") ? term.replace(/_/g, " ") : term;
}

function buildFrequencyMap(tokens) {
  const map = {};
  tokens.forEach((token) => {
    const stem = stemmer.stem(normalizeSynonym(token));
    if (!map[stem]) map[stem] = { stem, original: token, count: 0 };
    map[stem].count += 1;
  });
  return map;
}
function extractTopKeywords(jdText, resumeText, topN = 25) {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  const jdUnigrams = cleanAndTokenize(jdText);
  const resumeUnigrams = cleanAndTokenize(resumeText);

  const jdCorpus = [...jdUnigrams, ...buildBigrams(jdUnigrams)].join(" ");
  const resumeCorpus = [...resumeUnigrams, ...buildBigrams(resumeUnigrams)].join(" ");

  tfidf.addDocument(jdCorpus);
  tfidf.addDocument(resumeCorpus);

  const scores = [];
  tfidf.listTerms(0).forEach((item) => {
    scores.push({ term: item.term, tfidf: item.tfidf });
  });

  return scores
    .sort((a, b) => b.tfidf - a.tfidf)
    .slice(0, topN)
    .map((s) => displayPhrase(s.term));
}

function cosineSimilarity(textA, textB) {
  const tokensA = stemTokens(cleanAndTokenize(textA));
  const tokensB = stemTokens(cleanAndTokenize(textB));

  const vocab = new Set([...tokensA, ...tokensB]);
  const freqA = {};
  const freqB = {};
  tokensA.forEach((t) => (freqA[t] = (freqA[t] || 0) + 1));
  tokensB.forEach((t) => (freqB[t] = (freqB[t] || 0) + 1));

  let dot = 0;
  let magA = 0;
  let magB = 0;

  vocab.forEach((term) => {
    const a = freqA[term] || 0;
    const b = freqB[term] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
function matchKeywords(jdKeywords, resumeText) {
  const resumeTokensRaw = cleanAndTokenize(resumeText);
  const resumeStems = new Set(stemTokens(resumeTokensRaw));

  const matched = [];
  const missing = [];

  jdKeywords.forEach((kw) => {
    const words = kw.split(" ");
    const isPhrase = words.length > 1;

    if (isPhrase) {
      const allWordsPresent = words.every((w) =>
        resumeStems.has(stemmer.stem(normalizeSynonym(w)))
      );
      if (allWordsPresent) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    } else {
      const stem = stemmer.stem(normalizeSynonym(kw));
      if (resumeStems.has(stem)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }
  });

  return { matched, missing };
}

function detectSections(resumeText) {
  const detected = [];
  const missing = [];

  Object.entries(SECTION_PATTERNS).forEach(([section, pattern]) => {
    if (pattern.test(resumeText)) {
      detected.push(section);
    } else {
      missing.push(section);
    }
  });

  return { detected, missing };
}

function analyzeFormat(resumeText) {
  let score = 100;
  const notes = [];

  const wordCount = resumeText.trim().split(/\s+/).length;
  if (wordCount < 150) {
    score -= 20;
    notes.push("Resume seems too short — aim for at least 350-600 words.");
  } else if (wordCount > 1000) {
    score -= 10;
    notes.push("Resume is quite long — consider trimming to 1 page for freshers.");
  }

  const bulletCount = (resumeText.match(/[•●▪-]\s/g) || []).length;
  if (bulletCount < 3) {
    score -= 15;
    notes.push("Use bullet points to list achievements — ATS parsers prefer structured bullets.");
  }

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  if (!hasEmail) {
    score -= 15;
    notes.push("No email address detected — make sure contact info is in plain text, not an image.");
  }

  const hasPhone = /(\+?\d{1,3}[\s-]?)?\d{10}/.test(resumeText);
  if (!hasPhone) {
    score -= 10;
    notes.push("No phone number detected in plain text.");
  }

  const actionVerbCount = ACTION_VERBS.filter((v) =>
    new RegExp(`\\b${v}\\b`, "i").test(resumeText)
  ).length;
  if (actionVerbCount < 3) {
    score -= 15;
    notes.push("Add more strong action verbs (built, led, optimized, architected) to bullet points.");
  }

  const hasTables = /\t{2,}|\|\s*\|/.test(resumeText);
  if (hasTables) {
    score -= 10;
    notes.push("Avoid tables/columns — many ATS parsers misread multi-column layouts.");
  }

  return { score: Math.max(0, Math.round(score)), notes };
}

function scoreResume(resumeText, jobDescription) {
  const jdKeywords = extractTopKeywords(jobDescription, resumeText, 25);
  const { matched, missing } = matchKeywords(jdKeywords, resumeText);
  const keywordScore = jdKeywords.length
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0;

  const similarity = cosineSimilarity(resumeText, jobDescription);
  const semanticScore = Math.round(similarity * 100);

  const { detected, missing: missingSections } = detectSections(resumeText);
  const sectionScore = Math.round(
    (detected.length / Object.keys(SECTION_PATTERNS).length) * 100
  );

  const format = analyzeFormat(resumeText);

  const atsScore = Math.round(
    keywordScore * 0.4 +
      semanticScore * 0.25 +
      sectionScore * 0.15 +
      format.score * 0.2
  );

  const suggestions = [...format.notes];
  if (missing.length > 0) {
    suggestions.push(
      `Add these relevant keywords if genuinely applicable: ${missing.slice(0, 8).join(", ")}.`
    );
  }
  if (missingSections.length > 0) {
    suggestions.push(`Consider adding missing sections: ${missingSections.join(", ")}.`);
  }

  return {
    atsScore: Math.min(100, Math.max(0, atsScore)),
    keywordScore,
    semanticScore,
    sectionScore,
    formatScore: format.score,
    matchedKeywords: matched,
    missingKeywords: missing,
    detectedSections: detected,
    missingSections,
    suggestions,
  };
}

module.exports = { scoreResume, extractTopKeywords, cosineSimilarity, matchKeywords };

const { scoreResume, extractTopKeywords, cosineSimilarity, matchKeywords } = require("../nlpScorer");
describe("cosineSimilarity", () => {
  test("returns 1 for identical text", () => {
    const text = "React Node.js Express MongoDB REST API";
    expect(cosineSimilarity(text, text)).toBeCloseTo(1, 5);
  });

  test("returns 0 for completely unrelated text", () => {
    const a = "gardening flowers soil sunlight watering";
    const b = "spacecraft orbital mechanics propulsion thrust";
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  test("returns a value between 0 and 1 for partially overlapping text", () => {
    const a = "React Node.js Express MongoDB developer";
    const b = "React frontend developer with Python and Django";
    const score = cosineSimilarity(a, b);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });
});

describe("extractTopKeywords", () => {
  test("returns an array of keyword strings", () => {
    const jd = "We need a React developer with Node.js and MongoDB experience";
    const resume = "Built apps with React and Node.js";
    const keywords = extractTopKeywords(jd, resume, 10);
    expect(Array.isArray(keywords)).toBe(true);
    expect(keywords.length).toBeGreaterThan(0);
  });

  test("respects the topN limit", () => {
    const jd = "React Node MongoDB Express JavaScript TypeScript Python Java Docker Kubernetes AWS Azure GCP";
    const resume = "some resume text here";
    const keywords = extractTopKeywords(jd, resume, 5);
    expect(keywords.length).toBeLessThanOrEqual(5);
  });
});

describe("scoreResume", () => {
  const strongResume = `
    Jane Doe
    jane.doe@email.com | +91 9876543210 | linkedin.com/in/janedoe

    EDUCATION
    B.Tech in Computer Science, XYZ University

    SKILLS
    JavaScript, React, Node.js, Express, MongoDB, REST APIs, Git

    PROJECTS
    Built a full stack application using React and Node.js
    - Developed REST APIs with Express and MongoDB
    - Implemented authentication and authorization
    - Designed a responsive frontend with React

    EXPERIENCE
    Software Engineering Intern, ABC Corp
    - Built and deployed microservices using Node.js
    - Improved API response time by 30 percent
    - Led a small team on an internal tool
  `;

  const jd = `We are looking for a Software Engineer Intern with experience in
    React, Node.js, Express, MongoDB, REST APIs, and JavaScript. Familiarity
    with Git and cloud platforms like AWS is a plus.`;

  test("returns a complete result object with all expected fields", () => {
    const result = scoreResume(strongResume, jd);
    expect(result).toHaveProperty("atsScore");
    expect(result).toHaveProperty("keywordScore");
    expect(result).toHaveProperty("semanticScore");
    expect(result).toHaveProperty("sectionScore");
    expect(result).toHaveProperty("formatScore");
    expect(result).toHaveProperty("matchedKeywords");
    expect(result).toHaveProperty("missingKeywords");
    expect(result).toHaveProperty("detectedSections");
    expect(result).toHaveProperty("missingSections");
    expect(result).toHaveProperty("suggestions");
  });

  test("all scores are within 0-100 range", () => {
    const result = scoreResume(strongResume, jd);
    [result.atsScore, result.keywordScore, result.semanticScore, result.sectionScore, result.formatScore].forEach(
      (score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    );
  });

  test("a well-matched resume scores higher than an unrelated one", () => {
    const unrelatedResume = `
      John Smith
      Chef with 5 years experience in Italian cuisine.
      Skilled in pasta making, sauce preparation, and kitchen management.
      Worked at several restaurants managing daily food prep.
    `;

    const strongResult = scoreResume(strongResume, jd);
    const weakResult = scoreResume(unrelatedResume, jd);

    expect(strongResult.atsScore).toBeGreaterThan(weakResult.atsScore);
  });

  test("detects missing sections in a bare-bones resume", () => {
    const bareResume = "Skills: JavaScript, React";
    const result = scoreResume(bareResume, jd);
    expect(result.missingSections.length).toBeGreaterThan(0);
  });

  test("flags missing contact info when email and phone are absent", () => {
    const noContactResume = `
      SKILLS
      React, Node.js, Express, MongoDB

      PROJECTS
      Built a resume analyzer application
    `;
    const result = scoreResume(noContactResume, jd);
    const hasContactSuggestion = result.suggestions.some((s) =>
      /email|phone/i.test(s)
    );
    expect(hasContactSuggestion).toBe(true);
  });

  test("generates keyword suggestions when relevant keywords are missing", () => {
    const sparseResume = "I am a hard working student looking for opportunities.";
    const result = scoreResume(sparseResume, jd);
    expect(result.missingKeywords.length).toBeGreaterThan(0);
  });
});

describe("synonym-aware matching", () => {
  test("matches 'JS' in resume against 'JavaScript' in JD", () => {
    const { matched } = matchKeywords(["javascript"], "I know JS very well");
    expect(matched).toContain("javascript");
  });

  test("matches 'AWS' in resume against JD phrase using the full name", () => {
    const { matched } = matchKeywords(["aws"], "Experience deploying to AWS");
    expect(matched).toContain("aws");
  });

  test("matches leadership variants across tenses", () => {
    const { matched } = matchKeywords(["management"], "I led and managed a team of five");
    expect(matched).toContain("management");
  });
});

describe("bigram phrase extraction", () => {
  test("extracts multi-word phrases like 'machine learning' as a single keyword", () => {
    const jdText = "We need someone with strong machine learning and data science skills";
    const resumeText = "some resume text";
    const keywords = extractTopKeywords(jdText, resumeText, 15);
    const hasPhrase = keywords.some((k) => k.includes(" "));
    expect(hasPhrase).toBe(true);
  });

  test("matches a multi-word JD phrase when resume contains all its words", () => {
    const { matched } = matchKeywords(
      ["project management"],
      "Handled project management for three client engagements"
    );
    expect(matched).toContain("project management");
  });
});

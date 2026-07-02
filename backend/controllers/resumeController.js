const fs = require("fs");
const asyncHandler = require("express-async-handler");
const Resume = require("../models/Resume");
const { extractTextFromFile } = require("../utils/parseResume");
const { scoreResume } = require("../utils/nlpScorer");

// @desc  Upload resume + JD, run NLP analysis, save result
// @route POST /api/resume/analyze
const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a resume file (PDF or DOCX)");
  }

  const { jobDescription, jobTitle } = req.body;
  if (!jobDescription || jobDescription.trim().length < 20) {
    res.status(400);
    throw new Error("Please paste a job description (at least 20 characters)");
  }

  let resumeText;
  try {
    resumeText = await extractTextFromFile(req.file.path);
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    res.status(400);
    throw new Error("Could not read resume file. Please upload a valid PDF or DOCX.");
  }

  const result = scoreResume(resumeText, jobDescription);

  const resumeDoc = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    jobTitle: jobTitle || "Untitled Role",
    atsScore: result.atsScore,
    keywordScore: result.keywordScore,
    formatScore: result.formatScore,
    sectionScore: result.sectionScore,
    matchedKeywords: result.matchedKeywords,
    missingKeywords: result.missingKeywords,
    detectedSections: result.detectedSections,
    missingSections: result.missingSections,
    suggestions: result.suggestions,
    rawResumeText: resumeText.slice(0, 5000),
    rawJobDescription: jobDescription.slice(0, 3000),
  });

  // Clean up uploaded file after parsing — we only keep extracted text
  fs.unlink(req.file.path, () => {});

  res.status(201).json({ ...result, id: resumeDoc._id, createdAt: resumeDoc.createdAt });
});

// @desc  Get logged-in user's analysis history
// @route GET /api/resume/history
const getHistory = asyncHandler(async (req, res) => {
  const history = await Resume.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-rawResumeText -rawJobDescription");
  res.json(history);
});

// @desc  Get single analysis by id
// @route GET /api/resume/:id
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Analysis not found");
  }
  res.json(resume);
});

// @desc  Delete an analysis
// @route DELETE /api/resume/:id
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Analysis not found");
  }
  res.json({ message: "Analysis deleted" });
});

module.exports = { analyzeResume, getHistory, getResumeById, deleteResume };

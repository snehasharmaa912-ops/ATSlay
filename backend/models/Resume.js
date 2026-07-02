const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    jobTitle: { type: String, default: "Untitled Role" },
    atsScore: { type: Number, required: true },
    keywordScore: { type: Number, required: true },
    formatScore: { type: Number, required: true },
    sectionScore: { type: Number, required: true },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    detectedSections: [{ type: String }],
    missingSections: [{ type: String }],
    suggestions: [{ type: String }],
    rawResumeText: { type: String },
    rawJobDescription: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);

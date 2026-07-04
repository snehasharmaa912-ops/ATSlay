const { z } = require("zod");
const analyzeSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(20, "Job description must be at least 20 characters"),
  jobTitle: z.string().trim().max(150).optional().default("Untitled Role"),
});

module.exports = { analyzeSchema };

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { analyzeSchema } = require("../validators/resumeValidators");
const {
  analyzeResume,
  getHistory,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  validate(analyzeSchema),
  analyzeResume
);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);

module.exports = router;

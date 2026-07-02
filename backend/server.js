const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ATSlay API", time: new Date().toISOString() });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/resume", require("./routes/resume"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ATSlay backend running on port ${PORT}`));

const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const serviceRoutes = require("./src/routes/serviceRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const globalErrorHandler = require("./src/middlewares/globalErrorHandler");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, uptime: process.uptime(), ts: Date.now() })
);

app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);

// 404 handler for any unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Global error handler must be last
app.use(globalErrorHandler);

module.exports = app;
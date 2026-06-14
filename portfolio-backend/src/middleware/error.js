// ── 404 handler ───────────────────────────────────────────────────────────
exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
};

// ── Global error handler ───────────────────────────────────────────────────
exports.errorHandler = (err, req, res, next) => {
  // Multer file-size / file-type errors
  if (err.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ success: false, message: "File is too large." });
  if (err.message?.toLowerCase().includes("only") && err.message?.toLowerCase().includes("allowed"))
    return res.status(400).json({ success: false, message: err.message });

  // Mongoose validation
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(" | ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists.` });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError")
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });

  console.error("Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

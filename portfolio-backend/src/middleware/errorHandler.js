// ── Global Express Error Handler ──────────────────────────────────────────
// Must be the LAST app.use() call in server.js (4 args = error middleware).

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || "Internal Server Error";

  // ── Mongoose: duplicate key (e.g. unique email / slug) ─────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    statusCode = 400;
  }

  // ── Mongoose: schema validation failed ─────────────────────────────────
  if (err.name === "ValidationError") {
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
    statusCode = 400;
  }

  // ── Mongoose: invalid ObjectId ─────────────────────────────────────────
  if (err.name === "CastError") {
    message    = `Invalid ${err.path}: "${err.value}".`;
    statusCode = 400;
  }

  // ── JWT errors ──────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    message    = "Invalid token.";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message    = "Token has expired. Please log in again.";
    statusCode = 401;
  }

  // ── Multer errors ───────────────────────────────────────────────────────
  if (err.code === "LIMIT_FILE_SIZE") {
    message    = "File is too large. Please upload a smaller file.";
    statusCode = 400;
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    message    = "Unexpected file field.";
    statusCode = 400;
  }

  // Log in development; suppress stack in production
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR ${statusCode}] ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

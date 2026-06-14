require("dotenv").config(); // MUST be at the very top

const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const compression  = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit    = require("express-rate-limit");
const mongoose     = require("mongoose");

const authRoutes        = require("./routes/auth");
const analyticsRoutes   = require("./routes/analytics");
const visitorRoutes     = require("./routes/visitors");
const statsRoutes       = require("./routes/stats");
const contactRoutes     = require("./routes/contact");
const brandRoutes       = require("./routes/brand");
const performanceRoutes = require("./routes/performance");
const blogRoutes        = require("./routes/blogs");
const projectRoutes     = require("./routes/projects");
const educationRoutes   = require("./routes/education");

const errorHandler = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin:      process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods:     ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// ── Rate limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

app.use("/api/",      limiter);
app.use("/api/auth/", authLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/analytics",   analyticsRoutes);
app.use("/api/visitors",    visitorRoutes);
app.use("/api/stats",       statsRoutes);
app.use("/api/contact",     contactRoutes);
app.use("/api/brand",       brandRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/blogs",       blogRoutes);
app.use("/api/projects",    projectRoutes);
app.use("/api/education",   educationRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date() })
);

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
);

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ── DB + Start ─────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedAdmin();
    await seedBrand();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ── Seed admin user ────────────────────────────────────────────────────────
async function seedAdmin() {
  const User   = require("./models/User");
  const bcrypt = require("bcryptjs");

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({
      name:     "Japhet",
      email:    process.env.ADMIN_EMAIL,
      password: hash,
      role:     "admin",
    });
    console.log("👤 Admin user seeded:", process.env.ADMIN_EMAIL);
  }
}

// ── Seed brand defaults (runs once) ───────────────────────────────────────
async function seedBrand() {
  const Brand = require("./models/Brand");
  const count = await Brand.countDocuments();
  if (count === 0) {
    await Brand.create({
      name:    "Iradukunda Japhet",
      tagline: "Full-Stack Developer & Server Engineer",
      email:   process.env.ADMIN_EMAIL,
    });
    console.log("🎨 Brand defaults seeded.");
  }
}
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Storage factories ──────────────────────────────────────────────────────

const makeStorage = (folder, transforms = []) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder:          `japhet-portfolio/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
      transformation:  transforms.length ? transforms : undefined,
    },
  });

// Raw storage for PDFs (resume)
const makeRawStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder:          `japhet-portfolio/${folder}`,
      resource_type:   "raw",
      allowed_formats: ["pdf"],
    },
  });

const blogStorage    = makeStorage("blogs",    [{ width: 1200, height: 630,  crop: "fill", quality: "auto:good" }]);
const projectStorage = makeStorage("projects", [{ width: 1200, height: 800,  crop: "fill", quality: "auto:good" }]);
const avatarStorage  = makeStorage("avatars",  [{ width: 400,  height: 400,  crop: "fill", quality: "auto:good", gravity: "face" }]);
const brandStorage   = makeStorage("brand");
const generalStorage = makeStorage("general");
const resumeStorage  = makeRawStorage("resumes");

// ── File-type filter ───────────────────────────────────────────────────────

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image files are allowed."), false);
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") return cb(null, true);
  cb(new Error("Only PDF files are allowed."), false);
};

// ── Size helper ────────────────────────────────────────────────────────────

const mb = (n) => ({ fileSize: n * 1024 * 1024 });

// ── Multer instances ───────────────────────────────────────────────────────

const uploadBlog    = multer({ storage: blogStorage,    limits: mb(10), fileFilter: imageFilter });
const uploadProject = multer({ storage: projectStorage, limits: mb(10), fileFilter: imageFilter });
const uploadAvatar  = multer({ storage: avatarStorage,  limits: mb(5),  fileFilter: imageFilter });
const uploadBrand   = multer({ storage: brandStorage,   limits: mb(10), fileFilter: imageFilter });
const uploadGeneral = multer({ storage: generalStorage, limits: mb(20), fileFilter: imageFilter });
const uploadResume  = multer({ storage: resumeStorage,  limits: mb(10), fileFilter: pdfFilter  });

module.exports = {
  cloudinary,
  uploadBlog,
  uploadProject,
  uploadAvatar,
  uploadBrand,
  uploadGeneral,
  uploadResume,
};

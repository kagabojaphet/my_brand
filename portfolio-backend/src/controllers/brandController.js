// src/controllers/brandController.js
const Brand          = require("../models/Brand");
const { cloudinary } = require("../config/cloudinary");

const destroyOld = async (publicId) => {
  if (publicId) {
    try { await cloudinary.uploader.destroy(publicId); } catch (_) {}
  }
};

// GET /api/brand  (public)
exports.getBrand = async (req, res, next) => {
  try {
    let brand = await Brand.findOne();
    if (!brand) brand = await Brand.create({});
    res.json({ success: true, data: brand });
  } catch (err) { next(err); }
};

// PUT /api/brand  (admin)
exports.updateBrand = async (req, res, next) => {
  try {
    const {
      name, tagline, email, phone, location, bio, accentColor,
      availability, availabilityNote,
      github, linkedin, twitter, dribbble, website,
      seoTitle, seoDescription, seoKeywords,
    } = req.body;

    let brand = await Brand.findOne();
    if (!brand) brand = new Brand();

    if (name             !== undefined) brand.name             = name.trim();
    if (tagline          !== undefined) brand.tagline          = tagline.trim();
    if (email            !== undefined) brand.email            = email.trim().toLowerCase();
    if (phone            !== undefined) brand.phone            = phone.trim();
    if (location         !== undefined) brand.location         = location.trim();
    if (bio              !== undefined) brand.bio              = bio.trim();
    if (accentColor      !== undefined) brand.accentColor      = accentColor.trim();
    if (availabilityNote !== undefined) brand.availabilityNote = availabilityNote.trim();
    if (availability     !== undefined)
      brand.availability = availability === true || availability === "true";

    if (github   !== undefined) brand.socials.github   = github.trim();
    if (linkedin !== undefined) brand.socials.linkedin = linkedin.trim();
    if (twitter  !== undefined) brand.socials.twitter  = twitter.trim();
    if (dribbble !== undefined) brand.socials.dribbble = dribbble.trim();
    if (website  !== undefined) brand.socials.website  = website.trim();

    if (seoTitle       !== undefined) brand.seo.title       = seoTitle.trim();
    if (seoDescription !== undefined) brand.seo.description = seoDescription.trim();
    if (seoKeywords    !== undefined) brand.seo.keywords    = seoKeywords.trim();

    await brand.save();
    res.json({ success: true, data: brand, message: "Brand updated successfully." });
  } catch (err) { next(err); }
};

// POST /api/brand/logo  (admin)
exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file provided." });

    let brand = await Brand.findOne();
    if (!brand) brand = new Brand();

    await destroyOld(brand.logoPublicId);
    brand.logo         = req.file.path;
    brand.logoPublicId = req.file.filename;
    await brand.save();

    res.json({ success: true, logo: brand.logo, message: "Logo uploaded." });
  } catch (err) { next(err); }
};

// POST /api/brand/avatar  (admin)
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file provided." });

    let brand = await Brand.findOne();
    if (!brand) brand = new Brand();

    await destroyOld(brand.avatarPublicId);
    brand.avatar         = req.file.path;
    brand.avatarPublicId = req.file.filename;
    await brand.save();

    res.json({ success: true, avatar: brand.avatar, message: "Avatar uploaded." });
  } catch (err) { next(err); }
};
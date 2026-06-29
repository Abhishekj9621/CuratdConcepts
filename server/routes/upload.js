const express = require('express');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const ALLOWED_MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = ALLOWED_MIME_TYPES[file.mimetype] || path.extname(file.originalname) || '';
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, and GIF image files are allowed.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 10 }, // 8MB per file, up to 10 files
});

function buildAbsoluteUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// POST /api/upload — admin only, upload a single image, returns its public URL
router.post('/', authenticateToken, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError
        ? (err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large (max 8MB).' : err.message)
        : err.message;
      return res.status(400).json({ success: false, message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file was provided.' });
    }
    return res.status(201).json({
      success: true,
      url: buildAbsoluteUrl(req, req.file.filename),
    });
  });
});

// POST /api/upload/multiple — admin only, upload several images at once
router.post('/multiple', authenticateToken, (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError
        ? (err.code === 'LIMIT_FILE_SIZE' ? 'One or more images are too large (max 8MB each).' : err.message)
        : err.message;
      return res.status(400).json({ success: false, message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files were provided.' });
    }
    return res.status(201).json({
      success: true,
      urls: req.files.map((file) => buildAbsoluteUrl(req, file.filename)),
    });
  });
});

module.exports = router;

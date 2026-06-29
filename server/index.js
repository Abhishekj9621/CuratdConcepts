const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const uploadRoutes = require('./routes/upload');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// ─── Security & Core Middleware ───────────────────────────────────────────
// Allow uploaded images to be loaded cross-origin (Vercel client / Railway API)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// Raised from the 100kb default — listing payloads with several image URLs/
// amenities can exceed that easily and would otherwise fail with a 500/413.
app.use(express.json({ limit: '5mb' }));

// CORS — allow the configured frontend origin(s) plus localhost for dev
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ─── Routes ────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Curatd Concepts API is running' });
});

// Serve uploaded images statically (note: ephemeral on Railway redeploys,
// same caveat as server/data — see DEPLOYMENT.md)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public + admin-protected listings CRUD
app.use('/api/listings', listingsRoutes);

// Admin authentication
app.use('/api/admin', authRoutes);

// Admin-only image upload (multipart/form-data)
app.use('/api/upload', uploadRoutes);

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  // In production: use nodemailer or a service like SendGrid here
  console.log('Contact form submission:', { name, email, phone, message, subject });

  res.json({
    success: true,
    message: 'Thank you for reaching out! We will get back to you within 24 hours.',
  });
});

// Partner/Owner inquiry
app.post('/api/partner', (req, res) => {
  const { name, email, phone, propertyType, propertyLocation, message } = req.body;

  if (!name || !email || !propertyType) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  console.log('Partner inquiry:', { name, email, phone, propertyType, propertyLocation, message });

  res.json({
    success: true,
    message: 'Your partnership inquiry has been received! Our team will contact you within 48 hours.',
  });
});

// ─── Error handling ────────────────────────────────────────────────────────

// CORS / unmatched errors
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Not allowed by CORS.' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request payload is too large.' });
  }
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Curatd Concepts server running on http://localhost:${PORT}`);
});

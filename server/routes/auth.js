const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Limit login attempts to slow down brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    console.error('Admin credentials or JWT secret are not configured on the server.');
    return res.status(500).json({ success: false, message: 'Server is not configured correctly.' });
  }

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  try {
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, token, admin: { username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong during login.' });
  }
});

// GET /api/admin/me — verify a token is still valid & get current admin
router.get('/me', authenticateToken, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = router;


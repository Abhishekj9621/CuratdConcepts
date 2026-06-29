const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.admin = payload;
    next();
  });
}

module.exports = { authenticateToken };

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const store = require('../utils/listingsStore');

const router = express.Router();

function validateListingBody(body, isUpdate = false) {
  const required = ['name', 'type', 'location', 'price'];
  if (!isUpdate) {
    for (const field of required) {
      if (body[field] === undefined || body[field] === '') {
        return `Field "${field}" is required.`;
      }
    }
  }
  return null;
}

// GET /api/listings — public, returns all listings
router.get('/', (req, res) => {
  const listings = store.getAll();
  res.json({ success: true, data: listings });
});

// GET /api/listings/:id — public, returns a single listing
router.get('/:id', (req, res) => {
  const listing = store.getById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found.' });
  }
  res.json({ success: true, data: listing });
});

// POST /api/listings — admin only, create a new listing
router.post('/', authenticateToken, (req, res) => {
  try {
    const error = validateListingBody(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }
    const newListing = store.create(req.body);
    return res.status(201).json({ success: true, data: newListing });
  } catch (err) {
    console.error('CREATE LISTING ERROR:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/listings/:id — admin only, update an existing listing
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const updated = store.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.'
      });
    }

    return res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error('UPDATE LISTING ERROR:', err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// DELETE /api/listings/:id — admin only, delete a listing
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const deleted = store.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }
    return res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err) {
    console.error('DELETE LISTING ERROR:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

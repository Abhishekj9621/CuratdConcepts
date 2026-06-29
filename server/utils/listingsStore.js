const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'listings.json');

function readListings() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading listings data file:', err);
    return [];
  }
}

function writeListings(listings) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(listings, null, 2), 'utf-8');
}

// Normalize legacy `image` field to `images` array
function normalizeListing(listing) {
  if (!listing.images) {
    listing.images = listing.image ? [listing.image] : [];
    delete listing.image;
  }
  if (!listing.platformLinks) {
    listing.platformLinks = {};
  }
  return listing;
}

function getAll() {
  return readListings().map(normalizeListing);
}

function getById(id) {
  const listings = readListings();
  const found = listings.find((l) => l.id === Number(id));
  return found ? normalizeListing(found) : null;
}

function create(data) {
  const listings = readListings();
  const nextId = listings.length > 0 ? Math.max(...listings.map((l) => l.id)) + 1 : 1;
  const now = new Date().toISOString();

  // Support both `images` array and legacy `image` string
  let images = [];
  if (Array.isArray(data.images)) {
    images = data.images.filter(Boolean);
  } else if (data.image) {
    images = [data.image];
  }

  const newListing = {
    id: nextId,
    name: data.name,
    type: data.type,
    location: data.location,
    guests: Number(data.guests) || 0,
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    price: Number(data.price) || 0,
    rating: data.rating !== undefined ? Number(data.rating) : 5,
    reviews: data.reviews !== undefined ? Number(data.reviews) : 0,
    images,
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
    platformLinks: (data.platformLinks && typeof data.platformLinks === 'object') ? data.platformLinks : {},
    description: data.description || '',
    createdAt: now,
    updatedAt: now,
  };

  listings.push(newListing);
  writeListings(listings);
  return newListing;
}

function update(id, data) {
  const listings = readListings();
  const index = listings.findIndex((l) => l.id === Number(id));
  if (index === -1) return null;

  const existing = normalizeListing({ ...listings[index] });

  // Support both `images` array and legacy `image` string
  let images = existing.images;
  if (data.images !== undefined) {
    images = Array.isArray(data.images) ? data.images.filter(Boolean) : existing.images;
  } else if (data.image !== undefined) {
    images = data.image ? [data.image] : [];
  }

  const updated = {
    ...existing,
    name: data.name !== undefined ? data.name : existing.name,
    type: data.type !== undefined ? data.type : existing.type,
    location: data.location !== undefined ? data.location : existing.location,
    guests: data.guests !== undefined ? Number(data.guests) : existing.guests,
    bedrooms: data.bedrooms !== undefined ? Number(data.bedrooms) : existing.bedrooms,
    bathrooms: data.bathrooms !== undefined ? Number(data.bathrooms) : existing.bathrooms,
    price: data.price !== undefined ? Number(data.price) : existing.price,
    rating: data.rating !== undefined ? Number(data.rating) : existing.rating,
    reviews: data.reviews !== undefined ? Number(data.reviews) : existing.reviews,
    images,
    amenities: Array.isArray(data.amenities) ? data.amenities : existing.amenities,
    platforms: Array.isArray(data.platforms) ? data.platforms : existing.platforms,
    platformLinks: (data.platformLinks && typeof data.platformLinks === 'object')
      ? data.platformLinks
      : existing.platformLinks,
    description: data.description !== undefined ? data.description : existing.description,
    updatedAt: new Date().toISOString(),
  };

  listings[index] = updated;
  writeListings(listings);
  return updated;
}

function remove(id) {
  const listings = readListings();
  const index = listings.findIndex((l) => l.id === Number(id));
  if (index === -1) return false;

  listings.splice(index, 1);
  writeListings(listings);
  return true;
}

module.exports = { getAll, getById, create, update, remove };

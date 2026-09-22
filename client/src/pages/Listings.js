import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listings as allListingsData } from '../data/listings';
import useLiveRating from '../lib/useLiveRating';
import './Listings.css';

const DEFAULT_TYPE_FILTERS = ['Villa', 'Homestay', 'Beach Villa', 'Bungalow', 'Luxury Camp', 'Chalet'];

// Resolve first available image from a listing (handles legacy + new format)
function getFirstImage(listing) {
  if (Array.isArray(listing.images) && listing.images.length > 0) return listing.images[0];
  if (listing.image) return listing.image;
  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
}

function getAllImages(listing) {
  if (Array.isArray(listing.images) && listing.images.length > 0) return listing.images;
  if (listing.image) return [listing.image];
  return [];
}

// ── Listing Card ───────────────────────────────────────────────────────
function ListingCard({ listing }) {
  const firstImg = getFirstImage(listing);
  const imgCount = getAllImages(listing).length;
  const { rating, reviewCount } = useLiveRating(listing);
  const roomCount = Array.isArray(listing.roomTypes) ? listing.roomTypes.length : 0;

  return (
    // The whole card is a Link to this property's own page at
    // /listings/<hotelId> — every listing in src/data/listings.js gets
    // one of these automatically, no extra code needed per property.
    <Link to={`/listings/${listing.hotelId}`} className="listing-card">
      <div className="listing-card__image">
        <img src={firstImg} alt={listing.name} loading="lazy" />
        {imgCount > 1 && (
          <div className="listing-card__img-count">
            📷 {imgCount}
          </div>
        )}
        <div className="listing-card__badges">
          <span className="listing-card__type">{listing.type}</span>
        </div>
        <div className="listing-card__platforms">
          <span className="listing-card__platform-badge">Airbnb</span>
        </div>
      </div>
      <div className="listing-card__body">
        <div className="listing-card__rating">
          {rating ? (
            <>
              <span className="listing-card__star">★</span>
              <span>{rating}</span>
              <span className="listing-card__reviews">({reviewCount})</span>
            </>
          ) : (
            <span className="listing-card__new-badge">New{reviewCount > 0 ? ` · ${reviewCount} review${reviewCount === 1 ? '' : 's'}` : ''}</span>
          )}
        </div>
        <h3 className="listing-card__name">{listing.name}</h3>
        <p className="listing-card__location">📍 {listing.location}</p>
        {listing.description && (
          <p className="listing-card__desc">{listing.description}</p>
        )}
        <div className="listing-card__meta">
          <span>👥 {listing.guests} guests</span>
          <span>🛏 {listing.bedrooms} beds</span>
          <span>🚿 {listing.bathrooms} baths</span>
        </div>
        {listing.amenities && listing.amenities.length > 0 && (
          <div className="listing-card__amenities">
            {listing.amenities.slice(0, 3).map((a) => (
              <span key={a}>{a}</span>
            ))}
            {listing.amenities.length > 3 && (
              <span>+{listing.amenities.length - 3} more</span>
            )}
          </div>
        )}
        {roomCount > 0 && (
          <p className="listing-card__book-modes">
            Book the whole place, or {roomCount} room{roomCount === 1 ? '' : 's'} individually
          </p>
        )}
        <div className="listing-card__footer">
          <div>
            {listing.price > 0 ? (
              <>
                <span className="listing-card__price">₹{Number(listing.price).toLocaleString()}</span>
                <span className="listing-card__per"> / night</span>
              </>
            ) : (
              <span className="listing-card__price-note">See price on Airbnb</span>
            )}
          </div>
          <span className="btn-primary listing-card__btn">View Details</span>
        </div>
      </div>
    </Link>
  );
}

// ── Main Listings Page ────────────────────────────────────────────────────
export default function Listings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [allListings] = useState(allListingsData);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    let filtered = allListings;
    if (activeFilter !== 'All') {
      filtered = filtered.filter((l) => l.type === activeFilter);
    }
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    setListings(filtered);
  }, [activeFilter, sortBy, allListings]);

  // Property types shown as filter tabs. Starts from the default set and
  // adds any additional type found in the local listings data (see
  // src/data/listings.js), so a new `type` value there shows up as a
  // filter tab automatically without a code change here.
  const typeFilters = ['All', ...Array.from(
    new Set([...DEFAULT_TYPE_FILTERS, ...allListings.map((l) => l.type)].filter(Boolean))
  )];

  return (
    <div className="listings">
      {/* Hero */}
      <section className="listings__hero">
        <div className="listings__hero-bg">
          <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=80" alt="Listings" fetchpriority="high" />
          <div className="listings__hero-overlay" />
        </div>
        <div className="container listings__hero-content">
          <p className="section-label">Our Portfolio</p>
          <h1 className="listings__hero-title">Handpicked Properties</h1>
          <p className="listings__hero-sub">
            {allListings.length} exceptional stays across India's most sought-after destinations
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="listings__filters-bar">
        <div className="container listings__filters-inner">
          <div className="listings__filter-scroll">
            {typeFilters.map((f) => (
              <button
                key={f}
                className={`listings__filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="listings__filters-right">
            <div className="listings__select-wrap">
              <label htmlFor="sort-select">Sort</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container listings__filters-meta">
          <span className="listings__count">{listings.length} {listings.length === 1 ? 'property' : 'properties'} found</span>
          {activeFilter !== 'All' && (
            <button
              className="listings__clear-filters"
              onClick={() => setActiveFilter('All')}
            >
              Clear filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <section className="listings__grid-section">
        <div className="container">
          {listings.length === 0 ? (
            <div className="listings__empty">
              <span>🔍</span>
              <p>No properties match your filters. Try adjusting them.</p>
            </div>
          ) : (
            <div className="listings__grid">
              {listings.map((listing) => (
                <ListingCard key={listing.hotelId} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

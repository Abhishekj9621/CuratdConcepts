import React, { useState, useEffect } from 'react';
import { getListings } from '../api/api';
import './Listings.css';

const DEFAULT_TYPE_FILTERS = ['Villa', 'Homestay', 'Beach Villa', 'Bungalow', 'Luxury Camp', 'Chalet'];
const PLATFORMS = ['Airbnb', 'Booking.com', 'Agoda', 'MakeMyTrip'];

// Platform brand colours for the booking buttons
const PLATFORM_COLORS = {
  'Airbnb': { bg: '#FF5A5F', color: '#fff' },
  'Booking.com': { bg: '#003580', color: '#fff' },
  'Agoda': { bg: '#E9191D', color: '#fff' },
  'MakeMyTrip': { bg: '#E03E52', color: '#fff' },
};

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

// ── Listing Detail Modal ──────────────────────────────────────────────────
function ListingModal({ listing, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = getAllImages(listing);
  const mainImg = images.length > 0 ? images[activeImg] : null;

  const platformLinks = listing.platformLinks || {};

  return (
    <div className="listings__modal-overlay" onClick={onClose}>
      <div className="listings__modal" onClick={(e) => e.stopPropagation()}>
        <button className="listings__modal-close" onClick={onClose}>✕</button>

        {/* ── Image gallery ── */}
        <div className="listings__modal-gallery">
          <div className="listings__modal-image">
            {mainImg ? (
              <img src={mainImg} alt={listing.name} />
            ) : (
              <div className="listings__modal-image--empty">No Photo</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="listings__modal-thumbs">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  className={`listings__modal-thumb ${idx === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img src={url} alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="listings__modal-body">
          <span className="listings__modal-type">{listing.type}</span>
          <div className="listings__modal-rating">
            <span>★</span> {listing.rating} ({listing.reviewCount} reviews)
          </div>
          <h2>{listing.name}</h2>
          <p className="listings__modal-location">📍 {listing.location}</p>
          {listing.description && (
            <p className="listings__modal-desc">{listing.description}</p>
          )}
          <div className="listings__modal-meta">
            <div><strong>👥</strong> {listing.guests} Guests</div>
            <div><strong>🛏</strong> {listing.bedrooms} Bedrooms</div>
            <div><strong>🚿</strong> {listing.bathrooms} Bathrooms</div>
          </div>

          {listing.amenities && listing.amenities.length > 0 && (
            <div className="listings__modal-amenities">
              <strong>Amenities</strong>
              <div className="listings__modal-amenity-list">
                {listing.amenities.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Room Types (synced from the property management system) ── */}
          {Array.isArray(listing.roomTypes) && listing.roomTypes.length > 0 && (
            <div className="listings__modal-roomtypes">
              <strong>Room Types</strong>
              <div className="listings__modal-roomtypes-list">
                {listing.roomTypes.map((rt) => (
                  <div key={rt.id || rt.name} className="listings__modal-roomtype-card">
                    <div className="listings__modal-roomtype-head">
                      <span className="listings__modal-roomtype-name">{rt.name}</span>
                      <span className={`listings__modal-ac-badge ${rt.ac ? 'is-ac' : 'is-non-ac'}`}>
                        {rt.ac ? 'AC' : 'Non-AC'}
                      </span>
                    </div>
                    <div className="listings__modal-roomtype-meta">
                      {rt.roomCount > 0 && <span>{rt.roomCount} room{rt.roomCount === 1 ? '' : 's'}</span>}
                      <span>Sleeps {rt.maxOccupancy}</span>
                      {rt.bedType && <span>{rt.bedType}</span>}
                      {rt.sizeSqft && <span>{rt.sizeSqft} sqft</span>}
                    </div>
                    {rt.amenities && rt.amenities.length > 0 && (
                      <div className="listings__modal-roomtype-amenities">
                        {rt.amenities.map((a) => (
                          <span key={a}>{a}</span>
                        ))}
                      </div>
                    )}
                    {rt.price > 0 && (
                      <div className="listings__modal-roomtype-price">₹{Number(rt.price).toLocaleString('en-IN')} / night</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Booking Platforms ── */}
          {PLATFORMS.some((p) => platformLinks[p]) && (
            <div className="listings__modal-platforms">
              <strong>Book On</strong>
              <div className="listings__modal-platform-btns">
                {PLATFORMS.filter((p) => platformLinks[p]).map((p) => {
                  const link = platformLinks[p];
                  const style = PLATFORM_COLORS[p] || { bg: '#333', color: '#fff' };
                  return (
                    <a
                      key={p}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="listings__modal-platform-btn"
                      style={{ '--plat-bg': style.bg, '--plat-color': style.color }}
                    >
                      {p} →
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="listings__modal-footer">
            <div>
              <span className="listings__modal-price">₹{Number(listing.price).toLocaleString()}</span>
              <span> / night</span>
            </div>
            <a href="mailto:info@curatdconcepts.com" className="btn-primary">Enquire Now →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Listings Page ────────────────────────────────────────────────────
export default function Listings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [allListings, setAllListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getListings()
      .then((res) => {
        if (isMounted) {
          setAllListings(res.data || []);
          setLoadError('');
        }
      })
      .catch((err) => {
        if (isMounted) setLoadError(err.message || 'Failed to load listings.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let filtered = allListings;
    if (activeFilter !== 'All') {
      filtered = filtered.filter((l) => l.type === activeFilter);
    }
    if (activePlatform !== 'All') {
      filtered = filtered.filter((l) => l.platformLinks && l.platformLinks[activePlatform]);
    }
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    setListings(filtered);
  }, [activeFilter, activePlatform, sortBy, allListings]);

  // Property types shown as filter tabs. Starts from the default set and
  // adds any additional type synced in from the HMS (e.g. a custom Hotel
  // Type your team created in Settings there), so new categories show up
  // automatically without a code change here.
  const typeFilters = ['All', ...Array.from(
    new Set([...DEFAULT_TYPE_FILTERS, ...allListings.map((l) => l.type)].filter(Boolean))
  )];

  return (
    <div className="listings">
      {/* Hero */}
      <section className="listings__hero">
        <div className="listings__hero-bg">
          <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=80" alt="Listings" />
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
          <div className="listings__filter-group">
            <span className="listings__filter-label">Property Type</span>
            <div className="listings__filter-tabs">
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
          </div>
          <div className="listings__filter-group">
            <span className="listings__filter-label">Platform</span>
            <div className="listings__filter-tabs">
              <button
                className={`listings__filter-tab ${activePlatform === 'All' ? 'active' : ''}`}
                onClick={() => setActivePlatform('All')}
              >
                All
              </button>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  className={`listings__filter-tab ${activePlatform === p ? 'active' : ''}`}
                  onClick={() => setActivePlatform(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="listings__sort">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="listings__sort-select"
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="listings__grid-section">
        <div className="container">
          <p className="listings__count">{listings.length} properties found</p>
          {isLoading ? (
            <div className="listings__empty">
              <span>⏳</span>
              <p>Loading properties…</p>
            </div>
          ) : loadError ? (
            <div className="listings__empty">
              <span>⚠️</span>
              <p>{loadError}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="listings__empty">
              <span>🔍</span>
              <p>No properties match your filters. Try adjusting them.</p>
            </div>
          ) : (
            <div className="listings__grid">
              {listings.map((listing) => {
                const firstImg = getFirstImage(listing);
                const imgCount = getAllImages(listing).length;
                const platformLinks = listing.platformLinks || {};

                return (
                  <div
                    key={listing.hotelId}
                    className="listing-card"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <div className="listing-card__image">
                      <img src={firstImg} alt={listing.name} />
                      {imgCount > 1 && (
                        <div className="listing-card__img-count">
                          📷 {imgCount}
                        </div>
                      )}
                      <div className="listing-card__badges">
                        <span className="listing-card__type">{listing.type}</span>
                      </div>
                      <div className="listing-card__platforms">
                        {PLATFORMS.filter((p) => platformLinks[p]).slice(0, 2).map((p) => (
                          <a
                            key={p}
                            href={platformLinks[p]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="listing-card__platform-link"
                            onClick={(e) => e.stopPropagation()}
                            title={`Book on ${p}`}
                          >
                            {p}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="listing-card__body">
                      <div className="listing-card__rating">
                        <span className="listing-card__star">★</span>
                        <span>{listing.rating}</span>
                        <span className="listing-card__reviews">({listing.reviewCount})</span>
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
                      <div className="listing-card__footer">
                        <div>
                          <span className="listing-card__price">₹{Number(listing.price).toLocaleString()}</span>
                          <span className="listing-card__per"> / night</span>
                        </div>
                        <button className="btn-primary listing-card__btn">View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}

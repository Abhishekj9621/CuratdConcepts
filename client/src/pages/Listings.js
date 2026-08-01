import React, { useState, useEffect, useRef } from 'react';
import { listings as allListingsData } from '../data/listings';
import useLiveRating from '../lib/useLiveRating';
import './Listings.css';

const DEFAULT_TYPE_FILTERS = ['Villa', 'Homestay', 'Beach Villa', 'Bungalow', 'Luxury Camp', 'Chalet'];

// A description gets a "Read more" toggle once it's roughly this long —
// short enough that most 1-2 sentence descriptions never show the toggle
// at all, long enough that it only appears when there's real content to
// expand.
const DESC_EXPAND_THRESHOLD = 160;

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
  const [descExpanded, setDescExpanded] = useState(false);
  const images = getAllImages(listing);
  const mainImg = images.length > 0 ? images[activeImg] : null;
  const { rating, reviewCount } = useLiveRating(listing);

  const roomTypes = Array.isArray(listing.roomTypes) ? listing.roomTypes : [];
  const hasWholePlace = Boolean(listing.price);
  const description = listing.description || '';
  const descNeedsToggle = description.length > DESC_EXPAND_THRESHOLD;
  const closeButtonRef = useRef(null);

  // Lock background scroll while the modal is open, let Escape close it,
  // and move focus into the dialog so keyboard/screen-reader users land
  // somewhere sensible instead of focus staying on the card behind it.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="listings__modal-overlay" onClick={onClose}>
      <div
        className="listings__modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${listing.name} details`}
      >
        <button ref={closeButtonRef} className="listings__modal-close" onClick={onClose} aria-label="Close">✕</button>

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
                  <img src={url} alt={`View ${idx + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="listings__modal-body">
          <span className="listings__modal-type">{listing.type}</span>
          <div className="listings__modal-rating">
            <span>★</span> {rating} ({reviewCount} reviews)
          </div>
          <h2>{listing.name}</h2>
          <p className="listings__modal-location">📍 {listing.location}</p>

          {description && (
            <div className="listings__modal-desc-wrap">
              <p className={`listings__modal-desc ${descExpanded ? 'is-expanded' : ''}`}>
                {description}
              </p>
              {descNeedsToggle && (
                <button
                  type="button"
                  className="listings__modal-desc-toggle"
                  onClick={() => setDescExpanded((v) => !v)}
                >
                  {descExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
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

          {/* ── How to book: whole property + individual rooms, each with its
               own Airbnb link where available ── */}
          <div className="listings__modal-booking">
            <strong>Book on Airbnb</strong>

            {hasWholePlace && (
              <div className="listings__modal-book-option">
                <div className="listings__modal-book-option-info">
                  <span className="listings__modal-book-option-label">Entire Property</span>
                  <span className="listings__modal-book-option-price">
                    ₹{Number(listing.price).toLocaleString('en-IN')} <small>/ night</small>
                  </span>
                </div>
                {listing.airbnbLink ? (
                  <a
                    href={listing.airbnbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="listings__modal-airbnb-btn"
                  >
                    Book on Airbnb →
                  </a>
                ) : (
                  <span className="listings__modal-book-option-note">Enquire for availability</span>
                )}
              </div>
            )}

            {roomTypes.length > 0 && (
              <>
                <span className="listings__modal-rooms-label">
                  Or book an individual room
                </span>
                <div className="listings__modal-roomtypes-list">
                  {roomTypes.map((rt) => (
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
                      <div className="listings__modal-roomtype-footer">
                        {rt.price > 0 && (
                          <div className="listings__modal-roomtype-price">
                            ₹{Number(rt.price).toLocaleString('en-IN')} <small>/ night</small>
                          </div>
                        )}
                        {rt.airbnbLink ? (
                          <a
                            href={rt.airbnbLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="listings__modal-airbnb-btn listings__modal-airbnb-btn--sm"
                          >
                            Book on Airbnb →
                          </a>
                        ) : (
                          <span className="listings__modal-book-option-note">Enquire for availability</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="listings__modal-price-note">
              Prices shown here are updated by hand and may lag slightly behind Airbnb —
              tap "Book on Airbnb" for the current live price and availability.
            </p>
          </div>

          <div className="listings__modal-footer">
            <a href="mailto:official@curatdconcepts.com" className="listings__modal-enquire-link">
              Have a question? Enquire directly →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Listing Card ───────────────────────────────────────────────────────
function ListingCard({ listing, onClick }) {
  const firstImg = getFirstImage(listing);
  const imgCount = getAllImages(listing).length;
  const { rating, reviewCount } = useLiveRating(listing);
  const roomCount = Array.isArray(listing.roomTypes) ? listing.roomTypes.length : 0;

  return (
    // Clicking anywhere on the card opens the modal (mouse convenience).
    // The "View Details" button below is a real <button> further down in
    // this card, so it's already a native tab stop — pressing Enter/Space
    // on it fires a click that bubbles up to this onClick. That's the
    // keyboard path; this div intentionally isn't a second one, since a
    // div[role=button] wrapping a real <button> would just create two
    // tab stops doing the identical thing.
    <div className="listing-card" onClick={onClick}>
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
          <span className="listing-card__star">★</span>
          <span>{rating}</span>
          <span className="listing-card__reviews">({reviewCount})</span>
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
            <span className="listing-card__price">₹{Number(listing.price).toLocaleString()}</span>
            <span className="listing-card__per"> / night</span>
          </div>
          <button type="button" className="btn-primary listing-card__btn">View Details</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Listings Page ────────────────────────────────────────────────────
export default function Listings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [allListings] = useState(allListingsData);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

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
                <ListingCard
                  key={listing.hotelId}
                  listing={listing}
                  onClick={() => setSelectedListing(listing)}
                />
              ))}
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

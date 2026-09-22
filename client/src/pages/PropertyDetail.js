import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { listings } from '../data/listings';
import useLiveRating from '../lib/useLiveRating';
import './PropertyDetail.css';

// A description gets a "Read more" toggle once it's roughly this long.
const DESC_EXPAND_THRESHOLD = 220;

function getAllImages(listing) {
  if (Array.isArray(listing.images) && listing.images.length > 0) return listing.images;
  if (listing.image) return [listing.image];
  return ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'];
}

// ── Full-screen photo viewer ──────────────────────────────────────────────
function PropertyLightbox({ images, activeImg, setActiveImg, name, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveImg((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveImg((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, images.length, setActiveImg]);

  return (
    <div className="property-lightbox" onClick={onClose}>
      <button ref={closeButtonRef} className="property-lightbox__close" onClick={onClose} aria-label="Close">✕</button>

      {images.length > 1 && (
        <button
          type="button"
          className="property-lightbox__nav property-lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + images.length) % images.length); }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      <div className="property-lightbox__stage" onClick={(e) => e.stopPropagation()}>
        <img src={images[activeImg]} alt={`${name} — photo ${activeImg + 1} of ${images.length}`} />
        <div className="property-lightbox__count">{activeImg + 1} / {images.length}</div>
      </div>

      {images.length > 1 && (
        <button
          type="button"
          className="property-lightbox__nav property-lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % images.length); }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}
    </div>
  );
}

// ── Compact card used in the booking sidebar for an individually-bookable room ──
function RoomTypeCard({ rt }) {
  return (
    <div className="property__roomtype-card">
      <div className="property__roomtype-head">
        <span className="property__roomtype-name">{rt.name}</span>
        <span className={`property__ac-badge ${rt.ac ? 'is-ac' : 'is-non-ac'}`}>
          {rt.ac ? 'AC' : 'Non-AC'}
        </span>
      </div>
      <div className="property__roomtype-meta">
        {rt.roomCount > 0 && <span>{rt.roomCount} room{rt.roomCount === 1 ? '' : 's'}</span>}
        <span>Sleeps {rt.maxOccupancy}</span>
        {rt.bedType && <span>{rt.bedType}</span>}
        {rt.sizeSqft && <span>{rt.sizeSqft} sqft</span>}
      </div>
      {rt.amenities && rt.amenities.length > 0 && (
        <div className="property__roomtype-amenities">
          {rt.amenities.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
      )}
      <div className="property__roomtype-footer">
        {rt.price > 0 && (
          <div className="property__roomtype-price">
            ₹{Number(rt.price).toLocaleString('en-IN')} <small>/ night</small>
          </div>
        )}
        {rt.airbnbLink ? (
          <a
            href={rt.airbnbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="property__airbnb-btn property__airbnb-btn--sm"
          >
            Book on Airbnb →
          </a>
        ) : (
          <span className="property__book-option-note">Enquire for availability</span>
        )}
      </div>
    </div>
  );
}

// ── Main Property Detail Page ─────────────────────────────────────────────
// Renders one full page per property, driven entirely by the `hotelId` URL
// param — so every entry in src/data/listings.js automatically gets its
// own shareable page at /listings/<hotelId>, with no extra code needed
// when a new hotel/homestay is added to that file.
export default function PropertyDetail() {
  const { hotelId } = useParams();
  const listing = listings.find((l) => l.hotelId === hotelId);

  const [activeImg, setActiveImg] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { rating, reviewCount } = useLiveRating(listing || {});

  useEffect(() => {
    if (listing) {
      document.title = `${listing.name} — Curatd Concepts`;
    }
    window.scrollTo(0, 0);
  }, [listing]);

  // Unknown hotelId (bad link, typo, or a removed listing) — send visitors
  // back to the full portfolio rather than showing a broken page.
  if (!listing) {
    return <Navigate to="/listings" replace />;
  }

  const images = getAllImages(listing);
  const roomTypes = Array.isArray(listing.roomTypes) ? listing.roomTypes : [];
  const hasWholePlace = Boolean(listing.price) || Boolean(listing.airbnbLink);
  const description = listing.description || '';
  const descNeedsToggle = description.length > DESC_EXPAND_THRESHOLD;
  const sideImages = images.slice(1, 5);
  const otherListings = listings.filter((l) => l.hotelId !== listing.hotelId).slice(0, 3);

  return (
    <div className="property">
      {/* Breadcrumb */}
      <div className="property__breadcrumb-bar">
        <div className="container property__breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/listings">Listings</Link>
          <span>/</span>
          <span className="property__breadcrumb-current">{listing.name}</span>
        </div>
      </div>

      {/* Gallery */}
      <section className="property__gallery-section">
        <div className="container">
          <div className={`property__gallery ${sideImages.length === 0 ? 'property__gallery--solo' : ''}`}>
            <button
              type="button"
              className="property__gallery-main"
              onClick={() => { setActiveImg(0); setLightboxOpen(true); }}
            >
              <img src={images[0]} alt={listing.name} fetchpriority="high" />
            </button>

            {sideImages.length > 0 && (
              <div className="property__gallery-side">
                {sideImages.map((url, idx) => {
                  const isLastVisible = idx === sideImages.length - 1;
                  const remaining = images.length - 5;
                  return (
                    <button
                      key={url + idx}
                      type="button"
                      className="property__gallery-thumb"
                      onClick={() => { setActiveImg(idx + 1); setLightboxOpen(true); }}
                    >
                      <img src={url} alt={`${listing.name} view ${idx + 2}`} loading="lazy" />
                      {isLastVisible && remaining > 0 && (
                        <span className="property__gallery-more-overlay">+{remaining} more</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <button type="button" className="property__show-all-btn" onClick={() => { setActiveImg(0); setLightboxOpen(true); }}>
              🖼 Show all {images.length} photos
            </button>
          )}
        </div>
      </section>

      {lightboxOpen && (
        <PropertyLightbox
          images={images}
          activeImg={activeImg}
          setActiveImg={setActiveImg}
          name={listing.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Body */}
      <section className="property__body-section">
        <div className="container property__body-grid">
          {/* ── Left column ── */}
          <div className="property__main">
            <span className="property__type">{listing.type}</span>
            <div className="property__rating">
              {rating ? (
                <>
                  <span className="property__star">★</span> {rating} <span className="property__rating-count">({reviewCount} review{reviewCount === 1 ? '' : 's'})</span>
                </>
              ) : (
                <span className="property__new-badge">New{reviewCount > 0 ? ` · ${reviewCount} review${reviewCount === 1 ? '' : 's'}` : ''}</span>
              )}
            </div>
            <h1 className="property__title">{listing.name}</h1>
            <p className="property__location">📍 {listing.location}</p>

            <div className="property__meta">
              <div><strong>👥</strong> {listing.guests} Guests</div>
              <div><strong>🛏</strong> {listing.bedrooms} Bedrooms</div>
              <div><strong>🚿</strong> {listing.bathrooms} Bathrooms</div>
            </div>

            {description && (
              <div className="property__desc-wrap">
                <h2 className="property__section-title">About this property</h2>
                <p className={`property__desc ${descExpanded ? 'is-expanded' : ''}`}>
                  {description}
                </p>
                {descNeedsToggle && (
                  <button
                    type="button"
                    className="property__desc-toggle"
                    onClick={() => setDescExpanded((v) => !v)}
                  >
                    {descExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            {listing.amenities && listing.amenities.length > 0 && (
              <div className="property__amenities">
                <h2 className="property__section-title">Amenities</h2>
                <div className="property__amenity-list">
                  {listing.amenities.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            {roomTypes.length > 0 && (
              <div className="property__rooms">
                <h2 className="property__section-title">Rooms at this property</h2>
                <div className="property__roomtypes-list property__roomtypes-list--full">
                  {roomTypes.map((rt) => (
                    <RoomTypeCard key={rt.id || rt.name} rt={rt} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — booking sidebar ── */}
          <aside className="property__sidebar">
            <div className="property__booking-card">
              <strong className="property__booking-title">Book on Airbnb</strong>

              {hasWholePlace && (
                <div className="property__book-option">
                  <div className="property__book-option-info">
                    <span className="property__book-option-label">Entire Property</span>
                    {listing.price > 0 ? (
                      <span className="property__book-option-price">
                        ₹{Number(listing.price).toLocaleString('en-IN')} <small>/ night</small>
                      </span>
                    ) : (
                      <span className="property__book-option-note">See live price on Airbnb</span>
                    )}
                  </div>
                  {listing.airbnbLink ? (
                    <a
                      href={listing.airbnbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="property__airbnb-btn"
                    >
                      Book on Airbnb →
                    </a>
                  ) : (
                    <span className="property__book-option-note">Enquire for availability</span>
                  )}
                </div>
              )}

              {roomTypes.length > 0 && (
                <>
                  <span className="property__rooms-label">Or book an individual room</span>
                  <div className="property__roomtypes-list">
                    {roomTypes.map((rt) => (
                      <RoomTypeCard key={rt.id || rt.name} rt={rt} />
                    ))}
                  </div>
                </>
              )}

              <p className="property__price-note">
                Prices shown here are updated by hand and may lag slightly behind Airbnb —
                tap "Book on Airbnb" for the current live price and availability.
              </p>

              <a href="mailto:official@curatdconcepts.com" className="property__enquire-link">
                Have a question? Enquire directly →
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ── More stays — hidden automatically when this is the only listing ── */}
      {otherListings.length > 0 && (
        <section className="property__more-section">
          <div className="container">
            <h2 className="property__section-title">More Curatd Stays</h2>
            <div className="property__more-grid">
              {otherListings.map((l) => (
                <Link key={l.hotelId} to={`/listings/${l.hotelId}`} className="property__more-card">
                  <img src={getAllImages(l)[0]} alt={l.name} loading="lazy" />
                  <div className="property__more-card-body">
                    <h3>{l.name}</h3>
                    <p>📍 {l.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container property__back-row">
        <Link to="/listings" className="btn-outline">← Back to all listings</Link>
      </div>
    </div>
  );
}

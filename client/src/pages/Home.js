import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listings } from '../data/listings';
import useLiveRating from '../lib/useLiveRating';
import PlanSwitcher from '../components/PlanSwitcher';
import './Home.css';

// Stats block on the homepage — all four numbers are computed from the
// local listings data (client/src/data/listings.js), not hardcoded. Add,
// remove, or edit a property there and these update automatically.
const uniqueDestinations = new Set(listings.map((l) => l.location).filter(Boolean));

// Every whole-place listing counts as 1 bookable unit; a property with
// individually-bookable rooms adds each of those rooms instead.
const totalBookableUnits = listings.reduce((sum, l) => {
  if (Array.isArray(l.roomTypes) && l.roomTypes.length > 0) {
    return sum + l.roomTypes.reduce((s, rt) => s + (Number(rt.roomCount) || 1), 0);
  }
  return sum + 1;
}, 0);

const averageRating = listings.length
  ? listings.reduce((sum, l) => sum + (Number(l.rating) || 0), 0) / listings.length
  : 0;

const stats = [
  { value: `${listings.length}`, label: 'Curated properties' },
  { value: `${uniqueDestinations.size}`, label: 'Destinations' },
  { value: `${totalBookableUnits}`, label: 'Bookable rooms & stays' },
  {
    value: listings.length ? `${Math.round((averageRating / 5) * 100)}%` : '—',
    label: 'Guest satisfaction',
  },
];

const plans = [
  {
    key: 'lease',
    tabLabel: 'Lease Model',
    tagline: 'Guaranteed Income',
    title: 'Fixed Monthly Rent',
    desc: 'We lease your property at a fixed rent, whether it\'s booked every night or not. Zero involvement needed from you.',
    features: [
      'Guaranteed monthly rent',
      'Zero involvement needed',
      'We handle everything',
      'Property maintained at our cost',
    ],
    ctaText: 'Enquire About Lease',
    ctaLink: '/contact',
    accent: false,
  },
  {
    key: 'revenue',
    tabLabel: 'Revenue Share',
    tagline: 'Higher Ceiling',
    title: 'Shared Success',
    desc: 'We manage your property and split the profits. You keep full ownership and benefit from our OTA expertise.',
    features: [
      'Higher earning potential',
      'Transparent monthly reporting',
      'Fully-optimized Airbnb listing',
      'You stay fully in control',
    ],
    ctaText: 'Enquire About Revenue Share',
    ctaLink: '/contact',
    accent: true,
    badge: 'Recommended',
  },
];

const testimonials = [
  {
    text: 'Curatd Concepts transformed our unused property into a revenue-generating machine. We earn more than we ever imagined with zero hassle.',
    author: 'Arun Pandey',
    role: 'Owner, Nirvana Stays, Udaipur',
  },
  {
    text: 'The property we stayed at through Curatd felt genuinely special. The curation is impeccable, and the whole experience was seamless.',
    author: 'Priya & Aryan Shah',
    role: 'Guests, Nirvana Stays, Udaipur',
  },
];

function getFirstImage(listing) {
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    return listing.images[0];
  }
  if (listing.image) {
    return listing.image;
  }
  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
}

// Top 3 highest-rated properties from the local listings data (see
// src/data/listings.js) — recomputed automatically whenever that file
// changes, no fetch needed.
const featuredProperties = [...listings].sort((a, b) => b.rating - a.rating).slice(0, 3);

function FeaturedCard({ p }) {
  const { rating } = useLiveRating(p);
  return (
    <div className="home__card">
      <div className="home__card-image">
        <img
          src={getFirstImage(p)}
          alt={p.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
          }}
        />
        <span className="home__card-type">{p.type}</span>
      </div>
      <div className="home__card-body">
        <div className="home__card-rating">
          <span className="home__card-star">★</span>
          <span>{rating}</span>
        </div>
        <h3 className="home__card-name">{p.name}</h3>
        <p className="home__card-location">📍 {p.location}</p>
        <div className="home__card-footer">
          <div>
            <span className="home__card-price">₹{Number(p.price || 0).toLocaleString()}</span>
            <span className="home__card-per"> / night</span>
          </div>
          <Link to="/listings" className="home__card-btn">View →</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="home__hero">
        <div className="mesh-bg" aria-hidden="true" />
        <div className="container home__hero-grid">
          <div className="home__hero-copy">
            <p className="section-label">Premium Property Management</p>
            <h1 className="home__hero-title">
              Exceptional stays,<br />
              <span className="text-gradient">expertly managed.</span>
            </h1>
            <p className="home__hero-subtitle">
              We partner with property owners across India to create unforgettable
              guest experiences — listed and booked entirely on Airbnb.
            </p>
            <div className="home__hero-ctas">
              <Link to="/listings" className="btn-primary btn-jewel">Explore Properties →</Link>
              <Link to="/what-we-do" className="btn-outline">Partner With Us</Link>
            </div>
          </div>

          <div className="home__hero-visual">
            <div className="home__hero-image">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"
                alt="A Curatd Concepts property at dusk"
                fetchpriority="high"
              />
            </div>
            <div className="home__hero-float glass">
              <div className="home__hero-float-stars">★★★★★</div>
              <strong>
                {listings.length ? `${Math.round((averageRating / 5) * 100)}%` : '—'} Guest Satisfaction
              </strong>
              <span>Across {listings.length} propert{listings.length === 1 ? 'y' : 'ies'}</span>
            </div>
            <div className="home__hero-platforms glass">
              <span>Book on</span>
              <div>
                <strong>Airbnb</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bento stats ─────────────────────────────────────────────── */}
      <section className="home__bento">
        <div className="container home__bento-grid">
          {stats.map((s, i) => (
            <div key={s.label} className={`home__bento-item home__bento-item--${i}`}>
              <span className="home__bento-value">{s.value}</span>
              <span className="home__bento-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Listings ───────────────────────────────────────── */}
      <section className="home__section">
        <div className="container">
          <div className="home__section-header">
            <div>
              <p className="section-label">Handpicked Stays</p>
              <h2 className="home__section-title">Featured Properties</h2>
            </div>
            <Link to="/listings" className="btn-outline">View All →</Link>
          </div>

          {featuredProperties.length === 0 ? (
            <p className="home__cards-empty">
              Featured properties are on their way — check back soon, or browse the full portfolio.
            </p>
          ) : (
            <div className="home__cards">
              {featuredProperties.map((p) => (
                <FeaturedCard key={p.hotelId} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Two Models — plan switcher ──────────────────────────────── */}
      <section className="home__section home__how">
        <div className="container">
          <div className="home__section-center">
            <p className="section-label" style={{ margin: '0 auto 18px' }}>For Property Owners</p>
            <h2 className="home__section-title">Two Simple Models</h2>
            <p className="home__section-subtitle">
              Whether you want a guaranteed income or prefer to share profits, we have the right model for you.
            </p>
          </div>
          <PlanSwitcher plans={plans} />
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────────────── */}
      <section className="home__section home__testimonials">
        <div className="mesh-bg" aria-hidden="true" />
        <div className="container home__testimonial-layout">
          <p className="section-label" style={{ margin: '0 auto 18px' }}>Testimonials</p>
          <h2 className="home__section-title">What People Say</h2>
          <div className="home__testimonial-slider">
            {testimonials.map((t, i) => (
              <div
                key={t.author}
                className={`home__testimonial ${i === activeTestimonial ? 'home__testimonial--active' : ''}`}
              >
                <blockquote>"{t.text}"</blockquote>
                <div className="home__testimonial-author">
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="home__testimonial-dots">
            {testimonials.map((t, i) => (
              <button
                key={t.author}
                className={`home__dot ${i === activeTestimonial ? 'home__dot--active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Show testimonial from ${t.author}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────── */}
      <section className="home__cta-banner">
        <div className="mesh-bg" aria-hidden="true" />
        <div className="container home__cta-inner">
          <div>
            <h2 className="home__cta-title">Own a Property? Let's Talk.</h2>
            <p className="home__cta-text">
              Join our growing portfolio and let us turn your property into a premium hospitality experience.
            </p>
          </div>
          <Link to="/contact" className="btn-primary btn-jewel" style={{ whiteSpace: 'nowrap' }}>
            Get In Touch →
          </Link>
        </div>
      </section>
    </div>
  );
}

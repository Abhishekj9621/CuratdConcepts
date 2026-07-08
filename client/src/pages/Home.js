import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListings } from '../api/api';
import './Home.css';

const stats = [
  { value: '50+', label: 'Curated Properties' },
  { value: '12', label: 'Destinations' },
  { value: '4', label: 'OTA Platforms' },
  { value: '98%', label: 'Guest Satisfaction' },
];

const platforms = ['Airbnb', 'Booking.com', 'Agoda', 'MakeMyTrip'];

const testimonials = [
  {
    text: 'Curatd Concepts transformed our unused property into a revenue-generating machine. We earn more than we ever imagined with zero hassle.',
    author: 'Rajiv Mehta',
    role: 'Villa Owner, Coorg',
  },
  {
    text: 'As guests, every property we stayed at through Curatd felt genuinely special. The curation is impeccable.',
    author: 'Priya & Aryan Shah',
    role: 'Guests, Goa',
  },
  {
    text: 'The revenue-share model was a game-changer for us. Professional management without giving up ownership.',
    author: 'Sunita Rao',
    role: 'Property Owner, Munnar',
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

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Pull the top 3 rated properties from the API for the featured section
  useEffect(() => {
    getListings()
      .then((res) => {
        const sorted = [...(res.data || [])].sort((a, b) => b.rating - a.rating);
        setFeaturedProperties(sorted.slice(0, 3));
      })
      .catch(() => setFeaturedProperties([]));
  }, []);

  return (
    <div className="home">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="home__hero">
        <div className="home__hero-bg">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
            alt="Luxury property"
          />
          <div className="home__hero-overlay" />
        </div>
        <div className="home__hero-content">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>Premium Property Management</p>
          <h1 className="home__hero-title">
            Exceptional Stays,<br />
            <em>Expertly Managed</em>
          </h1>
          <p className="home__hero-subtitle">
            We partner with property owners across India to create unforgettable guest experiences — listed on Airbnb, Booking.com, Agoda & more.
          </p>
          <div className="home__hero-ctas">
            <Link to="/listings" className="btn-primary">Explore Properties</Link>
            <Link to="/what-we-do" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
              Partner With Us →
            </Link>
          </div>
        </div>
        <div className="home__hero-platforms">
          <p>Listed on</p>
          {platforms.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────── */}
      <section className="home__stats">
        {stats.map((s) => (
          <div key={s.label} className="home__stat">
            <span className="home__stat-value">{s.value}</span>
            <span className="home__stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ─── Featured Listings ────────────────────────────────────── */}
      <section className="home__section home__featured">
        <div className="container">
          <div className="home__section-header">
            <div>
              <p className="section-label">Handpicked Stays</p>
              <h2 className="home__section-title">Featured Properties</h2>
            </div>
            <Link to="/listings" className="btn-outline">View All →</Link>
          </div>
          <div className="home__cards">
            {featuredProperties.map((p) => (
              <div key={p.hotelId} className="home__card">
                <div className="home__card-image">
                  <img
                    src={getFirstImage(p)}
                    alt={p.name}
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
                    <span>{p.rating}</span>
                  </div>
                  <h3 className="home__card-name">{p.name}</h3>
                  <p className="home__card-location">📍 {p.location}</p>
                  <div className="home__card-footer">
                    <div>
                      <span className="home__card-price">₹{p.price.toLocaleString()}</span>
                      <span className="home__card-per"> / night</span>
                    </div>
                    <Link to="/listings" className="home__card-btn">View →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section className="home__section home__how" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="home__section-center">
            <p className="section-label">For Property Owners</p>
            <h2 className="home__section-title">Two Simple Models</h2>
            <p className="home__section-subtitle">
              Whether you want a guaranteed income or prefer to share profits, we have the right model for you.
            </p>
          </div>
          <div className="home__models">
            <div className="home__model-card">
              <h3>Lease Model</h3>
              <p>We lease your property at a fixed rent. You get guaranteed monthly income with zero management responsibility.</p>
              <ul>
                <li>✓ Guaranteed monthly rent</li>
                <li>✓ Zero involvement needed</li>
                <li>✓ We handle everything</li>
                <li>✓ Property maintained well</li>
              </ul>
              <Link to="/what-we-do" className="btn-outline">Learn More →</Link>
            </div>
            <div className="home__model-card home__model-card--accent">
              <h3>Revenue Share</h3>
              <p>We manage your property and split the profits. You retain ownership while benefiting from our OTA expertise.</p>
              <ul>
                <li>✓ Higher earning potential</li>
                <li>✓ Transparent reporting</li>
                <li>✓ Multi-platform listings</li>
                <li>✓ You stay in control</li>
              </ul>
              <Link to="/what-we-do" className="btn-primary">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="home__section home__testimonials">
        <div className="container">
          <div className="home__section-center">
            <p className="section-label">Testimonials</p>
            <h2 className="home__section-title">What People Say</h2>
          </div>
          <div className="home__testimonial-slider">
            {testimonials.map((t, i) => (
              <div
                key={i}
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
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`home__dot ${i === activeTestimonial ? 'home__dot--active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────── */}
      <section className="home__cta-banner">
        <div className="container">
          <div className="home__cta-inner">
            <div>
              <h2 className="home__cta-title">Own a Property? Let's Talk.</h2>
              <p className="home__cta-text">
                Join our growing portfolio and let us turn your property into a premium hospitality experience.
              </p>
            </div>
            <Link to="/contact" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Get In Touch →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

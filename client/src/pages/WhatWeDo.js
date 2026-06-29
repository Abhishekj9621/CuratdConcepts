import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './WhatWeDo.css';

const steps = [
  {
    num: '01',
    title: 'Property Assessment',
    desc: 'We visit your property, evaluate its condition, location, and guest potential. Our team gives you an honest assessment and projected earnings.',
  },
  {
    num: '02',
    title: 'Agreement & Onboarding',
    desc: 'We sign a transparent agreement — lease or revenue-share — with clear terms, timelines, and payment structures. No surprises.',
  },
  {
    num: '03',
    title: 'Property Preparation',
    desc: 'Our team handles interior styling, photography, amenity setup, and any required maintenance to meet our hospitality standards.',
  },
  {
    num: '04',
    title: 'OTA Listing & Launch',
    desc: 'We create optimized listings on Airbnb, Booking.com, Agoda, MakeMyTrip and more — with professional photography and compelling descriptions.',
  },
  {
    num: '05',
    title: 'Operations & Guest Management',
    desc: 'We handle all guest communications, check-ins, check-outs, housekeeping, and maintenance requests around the clock.',
  },
  {
    num: '06',
    title: 'Revenue & Reporting',
    desc: 'You receive regular performance reports — occupancy rates, revenue generated, guest reviews, and dynamic pricing insights.',
  },
];

const platforms = [
  { name: 'Airbnb', desc: 'Global reach with 4M+ listings. Best for premium, unique stays.', color: '#FF5A5F' },
  { name: 'Booking.com', desc: "Europe's leading OTA with 500M+ users and strong Indian market presence.", color: '#003580' },
  { name: 'Agoda', desc: 'Asia-Pacific powerhouse with deep penetration in Southeast and South Asian markets.', color: '#003B70' },
  { name: 'MakeMyTrip', desc: "India's #1 travel platform with 45M+ monthly active users.", color: '#EF4328' },
];

const faqs = [
  {
    q: 'Do you buy properties?',
    a: 'No. We either lease properties at a fixed monthly rent or enter into a revenue-sharing agreement. We do not require property ownership to manage your stay.',
  },
  {
    q: 'How does the lease model work?',
    a: 'We pay you a fixed monthly rent regardless of how many bookings we receive. You get guaranteed income and zero involvement in day-to-day operations.',
  },
  {
    q: 'How does the revenue-share model work?',
    a: 'We manage your property and take a percentage of the revenue generated. The split is agreed upfront and you receive detailed monthly reports. This model often generates more income than the lease model.',
  },
  {
    q: 'What kind of properties do you manage?',
    a: 'Villas, bungalows, homestays, heritage properties, beach houses, mountain chalets, farmhouses — any unique property with guest potential. We are selective about quality.',
  },
  {
    q: 'How do you handle maintenance and upkeep?',
    a: 'We have a network of vetted vendors, housekeepers, and maintenance professionals in every destination we operate in. All costs are accounted for in our agreements.',
  },
  {
    q: 'What if I want my property back?',
    a: 'All our agreements include exit clauses. For lease properties, the standard notice period is 90 days. Revenue-share agreements are typically more flexible.',
  },
];



export default function WhatWeDo() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="whatwedo">
      {/* Hero */}
      <section className="whatwedo__hero">
        <div className="whatwedo__hero-bg">
          <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=80" alt="What we do" />
          <div className="whatwedo__hero-overlay" />
        </div>
        <div className="container whatwedo__hero-content">
          <p className="section-label">Our Approach</p>
          <h1 className="whatwedo__hero-title">
            How We Turn Properties<br />
            <em>Into Experiences</em>
          </h1>
          <p className="whatwedo__hero-sub">
            We are a full-service property hospitality company. From onboarding to operations, we handle everything.
          </p>
        </div>
      </section>

      {/* Models */}
      <section className="whatwedo__models">
        <div className="container">
          <div className="whatwedo__section-header">
            <p className="section-label">Partnership Models</p>
            <h2>Two Ways to Partner With Us</h2>
            <p className="whatwedo__section-sub">
              Every property owner has different goals. We offer flexible models to suit your needs.
            </p>
          </div>
          <div className="whatwedo__models-grid">
            <div className="whatwedo__model">
              <div className="whatwedo__model-header">
                <h3>Lease Model</h3>
                <p className="whatwedo__model-tagline">Guaranteed Income, Zero Effort</p>
              </div>
              <div className="whatwedo__model-body">
                <p>We take your property on long-term lease and pay you a fixed monthly rent. You get predictable income whether your property is booked or not.</p>
                <ul className="whatwedo__model-list">
                  <li><span className="whatwedo__check">✓</span> Fixed monthly income guaranteed</li>
                  <li><span className="whatwedo__check">✓</span> Zero involvement from your end</li>
                  <li><span className="whatwedo__check">✓</span> Property well-maintained at our cost</li>
                  <li><span className="whatwedo__check">✓</span> Long-term security with exit clauses</li>
                  <li><span className="whatwedo__check">✓</span> Suitable for absentee owners</li>
                </ul>
                <div className="whatwedo__model-note">
                  Best for owners who want guaranteed income and minimal involvement.
                </div>
                <Link to="/contact" className="btn-outline whatwedo__model-cta">Enquire About Lease →</Link>
              </div>
            </div>

            <div className="whatwedo__model whatwedo__model--featured">
              <div className="whatwedo__model-badge">Most Popular</div>
              <div className="whatwedo__model-header">
                <h3>Revenue Share</h3>
                <p className="whatwedo__model-tagline">Higher Earning Potential</p>
              </div>
              <div className="whatwedo__model-body">
                <p>We manage your property and share the profits. You retain full ownership and benefit from our platform expertise and guest network.</p>
                <ul className="whatwedo__model-list">
                  <li><span className="whatwedo__check">✓</span> Higher earning ceiling</li>
                  <li><span className="whatwedo__check">✓</span> Transparent monthly reporting</li>
                  <li><span className="whatwedo__check">✓</span> Multi-platform OTA listings</li>
                  <li><span className="whatwedo__check">✓</span> Dynamic pricing optimization</li>
                  <li><span className="whatwedo__check">✓</span> You retain property ownership and control</li>
                </ul>
                <div className="whatwedo__model-note whatwedo__model-note--light">
                  Best for owners who want to maximize returns and stay informed.
                </div>
                <Link to="/contact" className="btn-primary whatwedo__model-cta">Enquire About Revenue Share →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="whatwedo__process">
        <div className="container">
          <div className="whatwedo__section-header">
            <p className="section-label">How It Works</p>
            <h2>Our 6-Step Process</h2>
            <p className="whatwedo__section-sub">
              From your first conversation with us to your first booking — here's what to expect.
            </p>
          </div>
          <div className="whatwedo__steps">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`whatwedo__step ${activeStep === i ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}
                onMouseEnter={() => setActiveStep(i)}
                onClick={() => setActiveStep(i)}
              >
                <div className="whatwedo__step-num-col">
                  <div className="whatwedo__step-circle">
                    {i < activeStep ? '✓' : step.num}
                  </div>
                </div>
                <div className="whatwedo__step-connector-col">
                  <div className="whatwedo__step-line">
                    <div className={`whatwedo__step-fill ${i < activeStep ? 'full' : ''}`} />
                  </div>
                </div>
                <div className="whatwedo__step-content">
                  <div className="whatwedo__step-tag">Step {step.num}</div>
                  <h3>
                    {step.title}
                    <span className="whatwedo__step-arrow">→</span>
                  </h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="whatwedo__faq">
        <div className="container">
          <div className="whatwedo__section-header">
            <p className="section-label">Common Questions</p>
            <h2>Frequently Asked</h2>
          </div>
          <div className="whatwedo__faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`whatwedo__faq-item ${openFaq === i ? 'open' : ''}`}>
                <button
                  className="whatwedo__faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className="whatwedo__faq-toggle">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="whatwedo__faq-a">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="whatwedo__cta">
        <div className="container">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>Ready to Start?</p>
          <h2>Let's Evaluate Your Property</h2>
          <p>Book a free consultation with our team. We'll assess your property and propose the best partnership model.</p>
          <div className="whatwedo__cta-buttons">
            <Link to="/contact" className="btn-primary">Book Free Consultation →</Link>
            <Link to="/listings" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              See Our Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

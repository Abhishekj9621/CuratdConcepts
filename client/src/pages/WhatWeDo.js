import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PlanSwitcher from '../components/PlanSwitcher';
import './WhatWeDo.css';

const plans = [
  {
    key: 'lease',
    tabLabel: 'Lease Model',
    tagline: 'Guaranteed Income, Zero Effort',
    title: 'Lease Model',
    desc: 'We take your property on long-term lease and pay you a fixed monthly rent. You get predictable income whether your property is booked or not.',
    features: [
      'Fixed monthly income guaranteed',
      'Zero involvement from your end',
      'Property well-maintained at our cost',
      'Long-term security with exit clauses',
      'Suitable for absentee owners',
    ],
    ctaText: 'Enquire About Lease',
    ctaLink: '/contact',
    accent: false,
  },
  {
    key: 'revenue',
    tabLabel: 'Revenue Share',
    tagline: 'Higher Earning Potential',
    title: 'Revenue Share',
    desc: 'We manage your property and share the profits. You retain full ownership and benefit from our platform expertise and guest network.',
    features: [
      'Higher earning ceiling',
      'Transparent monthly reporting',
      'Fully-optimized Airbnb listing',
      'Dynamic pricing optimization',
      'You retain property ownership and control',
    ],
    ctaText: 'Enquire About Revenue Share',
    ctaLink: '/contact',
    accent: true,
    badge: 'Most Popular',
  },
];

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
    title: 'Airbnb Listing & Launch',
    desc: 'We create an optimized, fully-verified Airbnb listing — professional photography, compelling copy, and a pricing strategy built for your property.',
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

const airbnbHighlights = [
  { stat: '4M+', label: 'Active listings worldwide, so your property sits inside a platform guests already trust' },
  { stat: '100%', label: 'Verified guest profiles and ID checks on every booking' },
  { stat: '24/7', label: 'Dedicated support and Host Guarantee protection on every stay' },
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
        <div className="mesh-bg" aria-hidden="true" />
        <div className="container whatwedo__hero-content">
          <p className="section-label">Our Approach</p>
          <h1 className="whatwedo__hero-title">
            How we turn properties<br />
            <span className="text-gradient">into experiences.</span>
          </h1>
          <p className="whatwedo__hero-sub">
            We are a full-service property hospitality company. From onboarding to operations, we handle everything.
          </p>
        </div>
      </section>

      {/* Models — plan switcher */}
      <section className="whatwedo__models">
        <div className="container">
          <div className="whatwedo__section-header">
            <p className="section-label" style={{ margin: '0 auto 18px' }}>Partnership Models</p>
            <h2>Two ways to partner with us</h2>
            <p className="whatwedo__section-sub">
              Every property owner has different goals. We offer flexible models to suit your needs.
            </p>
          </div>
          <PlanSwitcher plans={plans} />
        </div>
      </section>

      {/* Platform */}
      <section className="whatwedo__platforms">
        <div className="container">
          <div className="whatwedo__platform-showcase">
            <div className="whatwedo__platform-showcase-copy">
              <p className="section-label" style={{ margin: '0 0 18px' }}>Where You'll Be Listed</p>
              <h2>Listed exclusively on Airbnb</h2>
              <p className="whatwedo__section-sub" style={{ margin: '14px 0 0' }}>
                We list every property on Airbnb only — deliberately. One platform means
                one calendar, one pricing engine, and zero risk of double-bookings, so we
                can focus entirely on getting your listing right instead of managing it
                across four different dashboards.
              </p>
            </div>
            <div className="whatwedo__platform-highlights">
              {airbnbHighlights.map((h) => (
                <div key={h.label} className="whatwedo__platform-highlight">
                  <span className="whatwedo__platform-highlight-stat">{h.stat}</span>
                  <span className="whatwedo__platform-highlight-label">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="whatwedo__process">
        <div className="container">
          <div className="whatwedo__section-header">
            <p className="section-label" style={{ margin: '0 auto 18px' }}>How It Works</p>
            <h2>Our 6-step process</h2>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStep(i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={activeStep === i}
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
            <p className="section-label" style={{ margin: '0 auto 18px' }}>Common Questions</p>
            <h2>Frequently asked</h2>
          </div>
          <div className="whatwedo__faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`whatwedo__faq-item ${openFaq === i ? 'open' : ''}`}>
                <button
                  className="whatwedo__faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
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
        <div className="mesh-bg" aria-hidden="true" />
        <div className="container whatwedo__cta-inner">
          <p className="section-label" style={{ margin: '0 auto 18px' }}>Ready to Start?</p>
          <h2>Let's evaluate your property.</h2>
          <p>Book a free consultation with our team. We'll assess your property and propose the best partnership model.</p>
          <div className="whatwedo__cta-buttons">
            <Link to="/contact" className="btn-primary btn-jewel">Book Free Consultation →</Link>
            <Link to="/listings" className="btn-outline whatwedo__cta-outline">
              See Our Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

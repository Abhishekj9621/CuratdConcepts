import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import {
  RiLinkedinLine,
  RiTwitterXLine,
  RiMailLine,
} from 'react-icons/ri';
import logo from '../assets/Logo.svg';
import Abhishek from '../assets/Abhishek.jpeg';
import Dhiraj from '../assets/Dhiraj.png';

const team = [
  {
    name: 'Abhishek Jaiswal',
    role: 'Co-Founder',
    bio: 'Visionary entrepreneur with deep roots in Technology and Management. Abhishek leads strategy, partnerships, and portfolio growth across India.',
    photo: Abhishek,
    linkedin: 'https://www.linkedin.com/in/abhishek-jaiswal-82571a272/',
    twitter: 'https://twitter.com',
    email: 'mailto:abhishek@curatdconcepts.com',
  },
  {
    name: 'Dhiraj Mehta',
    role: 'Co-Founder',
    bio: 'Operations and revenue specialist who has scaled short-term rental businesses from ground up. Dhiraj drives performance, OTA strategy, and guest excellence.',
    photo: Dhiraj,
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'mailto:dhiraj@curatdconcepts.com',
  },
];

const values = [
  {
    number: '01',
    title: 'Curation Over Volume',
    desc: 'We are selective. Every property in our portfolio meets our standards for quality, uniqueness, and guest experience.',
  },
  {
    number: '02',
    title: 'Owner Partnership',
    desc: 'We treat property owners as partners, not clients. Transparent agreements, regular reporting, and mutual growth.',
  },
  {
    number: '03',
    title: 'Guest Obsession',
    desc: "A 5-star guest experience isn't optional — it's the foundation of everything we do.",
  },
  {
    number: '04',
    title: 'Data-Driven',
    desc: 'Dynamic pricing, platform analytics, and occupancy tracking keep every property performing at its peak.',
  },
];

const stats = [
  { value: '50+', label: 'Properties Managed' },
  { value: '12', label: 'Destinations' },
  { value: '98%', label: 'Guest Satisfaction' },
  { value: '4+', label: 'Years in Business' },
];

export default function AboutUs() {
  return (
    <div className="about">

      {/* ─── Hero ── */}
      <section className="about__hero">
        <div className="about__hero-bg">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80" alt="Beautiful property" />
          <div className="about__hero-overlay" />
        </div>
        <div className="container about__hero-content">
          <p className="section-label">Our Story</p>
          <h1 className="about__hero-title">
            Built on a Belief That<br />
            <em>Every Property Has Potential</em>
          </h1>
        </div>
      </section>

      {/* ─── Mission ── */}
      <section className="about__mission">
        <div className="container about__mission-inner">
          <p className="about__mission-text">
            Curatd Concepts exists to unlock the potential of India's most unique properties — and turn them into extraordinary guest experiences that generate real, lasting returns for their owners.
          </p>
        </div>
      </section>

      {/* ─── Stats Bar ── */}
      <section className="about__stats-bar">
        <div className="container about__stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="about__stat">
              <span className="about__stat-value">{s.value}</span>
              <span className="about__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Story ── */}
      <section className="about__story">
        <div className="container about__story-grid">
          <div className="about__story-left">
            <p className="section-label">Who We Are</p>
            <h2 className="about__story-title">We don't just manage properties.<br />We build hospitality brands.</h2>
          </div>
          <div className="about__story-right">
            <p>
              Curatd Concepts was born from a simple observation: India has an incredible wealth of unique properties — ancestral havelis, hillside villas, beachside retreats — that their owners don't have the time, expertise, or networks to monetize effectively.
            </p>
            <p>
              We stepped in to bridge that gap. We don't buy properties. Instead, we either take them on lease or enter into revenue-sharing partnerships with owners — and then we do what we do best: transform them into premium hospitality experiences, list them across major OTA platforms, and manage them end-to-end.
            </p>
            <p>
              Since 2021, we've grown to manage over 50 properties across 12 destinations in India, maintaining a 98% guest satisfaction rate and consistently generating above-market returns for our property partners.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Values ── */}
      <section className="about__values">
        <div className="container">
          <div className="about__values-header">
            <p className="section-label">What Guides Us</p>
            <h2>Four principles.<br />Every decision.</h2>
          </div>
          <div className="about__values-list">
            {values.map((v) => (
              <div key={v.title} className="about__value-row">
                <span className="about__value-num">{v.number}</span>
                <div className="about__value-body">
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ── */}
      <section className="about__team">
        <div className="container">
          <div className="about__team-header">
            <p className="section-label">The People</p>
            <h2>Meet The Founders</h2>
            <p className="about__team-sub">
              Two founders. One vision. A relentless obsession with exceptional hospitality.
            </p>
          </div>
          <div className="about__team-grid">
            {team.map((member) => (
              <div key={member.name} className="about__team-card">
                <div className="about__team-photo-wrap">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="about__team-photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="about__team-photo-fallback">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="about__team-info">
                  <div className="about__team-meta">
                    <h3>{member.name}</h3>
                    <span className="about__team-role">{member.role}</span>
                  </div>
                  <p>{member.bio}</p>
                  <div className="about__team-socials">
                    <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><RiLinkedinLine size={18} /></a>
                    <a href={member.twitter} target="_blank" rel="noreferrer" aria-label="Twitter"><RiTwitterXLine size={16} /></a>
                    <a href={member.email} aria-label="Email"><RiMailLine size={18} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ── */}
      <section className="about__cta">
        <div className="container">
          <p className="section-label about__cta-label">Join Our Portfolio</p>
          <h2>Ready to Work Together?</h2>
          <p>Tell us about your property and we'll find the right partnership model for you.</p>
          <Link to="/contact" className="btn-primary">Get In Touch →</Link>
        </div>
      </section>

    </div>
  );
}
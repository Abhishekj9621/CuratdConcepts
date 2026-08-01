import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer__top">

        {/* ── Brand ── */}
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={logo} alt="Curatd Concepts" loading="lazy" />
          </div>
          <p className="footer__tagline">
            Turning exceptional properties into unforgettable experiences — across India's most coveted destinations.
          </p>
          <div className="footer__platforms">
            <span className="footer__platforms-label">Book On</span>
            <div className="footer__platform-list">
              <span className="footer__platform-badge">Airbnb</span>
            </div>
          </div>
        </div>

        {/* ── Explore ── */}
        <div className="footer__nav-group footer__nav-group--explore">
          <h4 className="footer__nav-title">Explore</h4>
          <ul className="footer__nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/what-we-do">What We Do</Link></li>
            <li><Link to="/listings">Our Listings</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* ── For Property Owners ── */}
        <div className="footer__nav-group footer__nav-group--owners">
          <h4 className="footer__nav-title">For Property Owners</h4>
          <ul className="footer__nav-list">
            <li><Link to="/what-we-do">How We Manage</Link></li>
            <li><Link to="/contact">Partner With Us</Link></li>
          </ul>
        </div>

        {/* ── Contact ── */}
        <div className="footer__nav-group footer__nav-group--contact">
          <h4 className="footer__nav-title">Contact</h4>
          <ul className="footer__contact-list">
            <li>
              <FaEnvelope className="footer__contact-icon" />
              <a href="mailto:official@curatdconcepts.com">official@curatdconcepts.com</a>
            </li>
            <li>
              <FaPhoneAlt className="footer__contact-icon" />
              <a href="tel:+918082088010">+91 8082088010</a>
            </li>
            <li>
              <FaMapMarkerAlt className="footer__contact-icon" />
              <span>India</span>
            </li>
          </ul>

          <div className="footer__social">
            <a href="https://www.instagram.com/curatd.concepts/" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/1237593519436499?ref=PROFILE_EDIT_xav_ig_profile_page_web" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Curatd Concepts. All rights reserved.</p>
        <div className="footer__legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import logo from '../assets/Logo.svg';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home', num: '01' },
  { to: '/about', label: 'About Us', num: '02' },
  { to: '/what-we-do', label: 'What We Do', num: '03' },
  { to: '/listings', label: 'Listings', num: '04' },
  { to: '/contact', label: 'Contact', num: '05' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll, allow Escape-to-close, whenever the mobile
  // menu is open. The panel itself is only mounted in the DOM while open —
  // no CSS max-height collapse trick, so there's nothing for a link to
  // "leak" through from a supposedly-closed state.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--menu-open' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Curatd Concepts" className="navbar__logo-img" />
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="navbar__cta btn-primary">
          Partner With Us
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu — only exists in the DOM while open */}
      {menuOpen && (
        <>
          <button
            className="navbar__mobile-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="navbar__mobile">
            <ul className="navbar__mobile-links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="navbar__mobile-link-num">{link.num}</span>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="btn-primary navbar__mobile-cta"
              onClick={() => setMenuOpen(false)}
            >
              Partner With Us →
            </Link>
            <div className="navbar__mobile-socials">
              <a href="https://www.instagram.com/curatd.concepts/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.facebook.com/1237593519436499?ref=PROFILE_EDIT_xav_ig_profile_page_web" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

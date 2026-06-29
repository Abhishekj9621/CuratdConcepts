import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/what-we-do', label: 'What We Do' },
    { to: '/listings', label: 'Listings' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
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
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/contact" className="btn-primary" onClick={() => setMenuOpen(false)}>
          Partner With Us
        </Link>
      </div>
    </nav>
  );
}
import React, { useState } from 'react';
import './ContactUs.css';
import { HiOutlineMail, HiOutlinePhone, HiOutlineClock } from 'react-icons/hi';
import { RiWhatsappLine, RiInstagramLine, RiFacebookLine, RiLinkedinLine } from 'react-icons/ri';
import { submitContactForm } from '../lib/contactForm';

const INQUIRY_TYPES = [
  'I own a property and want to partner',
  'I want to book / know more about a property',
  'General enquiry',
  'Media / Press',
];

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: INQUIRY_TYPES[0],
    propertyLocation: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // The backend's contact schema doesn't have a dedicated property-
      // location field — fold it into the message so it's not lost.
      const message = form.propertyLocation
        ? `Property location: ${form.propertyLocation}\n\n${form.message}`
        : form.message;

      await submitContactForm({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message,
      });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: INQUIRY_TYPES[0], propertyLocation: '', message: '' });
    } catch (err) {
      // Log the real reason to the console so it's visible in DevTools
      // (Network tab / Console) instead of only showing the generic
      // banner below — this is what to check when the form fails.
      // eslint-disable-next-line no-console
      console.error('Contact form submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="contact">
      {/* Hero */}
      <section className="contact__hero">
        <div className="mesh-bg" aria-hidden="true" />
        <div className="container contact__hero-content">
          <p className="section-label">Get In Touch</p>
          <h1 className="contact__hero-title">
            Let's start a<br />
            <span className="text-gradient">conversation.</span>
          </h1>
          <p className="contact__hero-sub">
            Whether you own a property or are looking for a unique stay, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="contact__section">
        <div className="container contact__grid">
          {/* Info */}
          <div className="contact__info">
            <div className="contact__info-block">
              <p className="section-label">Reach Us</p>
              <h2>We're Here For You</h2>
              <p className="contact__info-text">
                Our team typically responds within 24 hours. For urgent property inquiries, feel free to call us directly.
              </p>
            </div>

            <div className="contact__details">
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <HiOutlineMail size={18} />
                </div>
                <div>
                  <strong>Email Us</strong>
                  <a href="mailto:official@curatdconcepts.com">official@curatdconcepts.com</a>
                </div>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <HiOutlinePhone size={18} />
                </div>
                <div>
                  <strong>Call Us</strong>
                  <a href="tel:+918082088010">+91 8082088010</a>
                </div>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <RiWhatsappLine size={18} />
                </div>
                <div>
                  <strong>WhatsApp</strong>
                  <a href="https://wa.me/918082088010" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
                </div>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <HiOutlineClock size={18} />
                </div>
                <div>
                  <strong>Response Time</strong>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>

            <div className="contact__social-block">
              <p className="contact__social-label">Follow Us</p>
              <div className="contact__social-links">
                <a href="https://www.instagram.com/curatd.concepts/" target="_blank" rel="noreferrer">
                  <RiInstagramLine size={15} />
                  Instagram
                </a>
                <a href="https://www.facebook.com/1237593519436499?ref=PROFILE_EDIT_xav_ig_profile_page_web" target="_blank" rel="noreferrer">
                  <RiFacebookLine size={15} />
                  Facebook
                </a>
              </div>
            </div>

            <div className="contact__property-cta">
              <h3>Own a Property?</h3>
              <p>Tell us about it and our team will schedule a free site assessment within 48 hours.</p>
            </div>
          </div>

          {/* Form */}
          <div className="contact__form-wrap">
            <form className="contact__form" onSubmit={handleSubmit}>
              <p className="section-label">Inquiry Form</p>
              <h3 className="contact__form-title">Send Us a Message</h3>

              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="contact-name">Your Name *</label>
                  <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" required />
                </div>
                <div className="contact__field">
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input id="contact-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email">Email Address *</label>
                <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" required />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-subject">What's this about? *</label>
                <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} required>
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {form.subject === INQUIRY_TYPES[0] && (
                <div className="contact__field">
                  <label htmlFor="contact-property-location">Property Location</label>
                  <input id="contact-property-location" type="text" name="propertyLocation" value={form.propertyLocation} onChange={handleChange} placeholder="e.g. Coorg, Karnataka" />
                </div>
              )}

              <div className="contact__field">
                <label htmlFor="contact-message">Message *</label>
                <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us more about your property or what you're looking for..." rows={5} required />
              </div>

              {status === 'success' && (
                <div className="contact__status contact__status--success" role="status" aria-live="polite">
                  ✓ Thank you! We'll get back to you within 24 hours.
                </div>
              )}
              {status === 'error' && (
                <div className="contact__status contact__status--error" role="alert" aria-live="assertive">
                  ✗ Something went wrong. Please email us directly at official@curatdconcepts.com
                </div>
              )}

              <button type="submit" className="btn-primary btn-jewel contact__submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
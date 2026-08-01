import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Listings from './pages/Listings';
import WhatWeDo from './pages/WhatWeDo';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public site shell — includes the Navbar/Footer chrome
function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// This app is fully static — there's no backend. Property data lives in
// src/data/listings.js (edit that file to add/update/remove properties),
// and the contact form submits via Web3Forms (see src/lib/contactForm.js).
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
          <Route path="/about" element={<SiteLayout><AboutUs /></SiteLayout>} />
          <Route path="/listings" element={<SiteLayout><Listings /></SiteLayout>} />
          <Route path="/what-we-do" element={<SiteLayout><WhatWeDo /></SiteLayout>} />
          <Route path="/contact" element={<SiteLayout><ContactUs /></SiteLayout>} />
          <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Listings from './pages/Listings';
import WhatWeDo from './pages/WhatWeDo';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Routes>
            {/* Public site */}
            <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
            <Route path="/about" element={<SiteLayout><AboutUs /></SiteLayout>} />
            <Route path="/listings" element={<SiteLayout><Listings /></SiteLayout>} />
            <Route path="/what-we-do" element={<SiteLayout><WhatWeDo /></SiteLayout>} />
            <Route path="/contact" element={<SiteLayout><ContactUs /></SiteLayout>} />

            {/* Admin portal — no public Navbar/Footer chrome */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

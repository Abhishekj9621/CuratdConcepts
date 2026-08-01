import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="mesh-bg" aria-hidden="true" />
      <div className="container notfound__inner">
        <p className="section-label">404</p>
        <h1 className="notfound__title">
          This page went off <span className="text-gradient">exploring.</span>
        </h1>
        <p className="notfound__text">
          The page you're looking for doesn't exist — it may have moved, or the link might be off.
        </p>
        <div className="notfound__ctas">
          <Link to="/" className="btn-primary btn-jewel">Back to Home →</Link>
          <Link to="/listings" className="btn-outline">See Our Properties</Link>
        </div>
      </div>
    </div>
  );
}

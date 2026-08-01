import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi2';
import './PlanSwitcher.css';

// Shared Lease vs Revenue Share comparison — used identically on the
// Home page (brief) and What We Do page (full detail) so the two never
// visually drift apart.
export default function PlanSwitcher({ plans }) {
  const [active, setActive] = useState(0);
  const plan = plans[active];

  return (
    <div className="plan-switcher">
      <div className="plan-toggle" role="tablist" aria-label="Partnership model">
        <span
          className="plan-toggle-highlight"
          style={{ transform: `translateX(${active * 100}%)` }}
          aria-hidden="true"
        />
        {plans.map((p, i) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={active === i}
            className={`plan-toggle-btn ${active === i ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            {p.tabLabel}
          </button>
        ))}
      </div>

      <div className={`plan-card ${plan.accent ? 'plan-card--accent' : ''}`}>
        {plan.badge && <span className="plan-card-badge">{plan.badge}</span>}
        <div className="plan-card-grid">
          <div className="plan-card-main">
            <p className="plan-card-tagline">{plan.tagline}</p>
            <h3 className="plan-card-title">{plan.title}</h3>
            <p className="plan-card-desc">{plan.desc}</p>
            <Link to={plan.ctaLink} className={`btn-primary ${plan.accent ? 'btn-jewel' : ''} plan-card-cta`}>
              {plan.ctaText}
            </Link>
          </div>
          <ul className="plan-card-features">
            {plan.features.map((f) => (
              <li key={f}>
                <HiCheckCircle className="plan-feature-icon" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

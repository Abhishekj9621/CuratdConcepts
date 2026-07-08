// This site has no backend of its own — it's a static React app that
// talks directly to the NovaStay HMS's public API. Property management
// (photos, room types, publishing, ratings, OTA links) all happens in the
// HMS's own management app; this file only ever reads public data and
// submits the contact form.
//
// Set REACT_APP_HMS_API_URL to your deployed HMS backend, e.g.
// https://api.curatdconcepts.com/api/v1 — see DEPLOYMENT.md.

const HMS_API_URL = (process.env.REACT_APP_HMS_API_URL || 'http://localhost:4000/api/v1').replace(/\/+$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${HMS_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // No JSON body — fine for e.g. a 204.
  }

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

// Every published property, with photos, room types (incl. AC/Non-AC),
// amenities, rating, and OTA links already resolved server-side.
export const getListings = () => request('/public/listings');

// Contact form (also used for partner/owner inquiries — the `subject`
// field distinguishes inquiry type, see ContactUs.js).
export const submitContactForm = (payload) =>
  request('/public/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

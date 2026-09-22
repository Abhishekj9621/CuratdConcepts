// ───────────────────────────────────────────────────────────────────────
// GOOGLE RATINGS — pull a property's live rating + review count straight
// from its Google Business/Maps listing
// ───────────────────────────────────────────────────────────────────────
// This uses Google's own Maps JavaScript API (Places library) directly in
// the browser — the officially-supported way to do this client-side, no
// backend or server involved. Google's plain REST API does NOT work from
// browser JS (it blocks cross-origin requests) — this JS library is the
// correct way to do it in a static site like this one.
//
// For a property to show a LIVE Google rating, it needs two things:
//   1. A Google Maps API key configured below (one-time, site-wide).
//   2. Its own `googlePlaceId` set in src/data/listings.js.
// Any property without a Place ID (or if the key isn't set up yet, or the
// request fails) just keeps showing the rating/reviewCount you entered by
// hand in listings.js — nothing breaks either way.
//
// ONE-TIME SETUP (about 5 minutes):
//   1. Go to https://console.cloud.google.com/ and create (or pick) a project.
//   2. In "APIs & Services" → "Library", enable the "Maps JavaScript API".
//   3. In "APIs & Services" → "Credentials", create an API key.
//   4. Click into that key → "Application restrictions" → "Websites" and
//      add your domain (e.g. curatdconcepts.com/*) so nobody else can use
//      your key if they find it in your site's source code.
//   5. In client/.env, set:
//        REACT_APP_GOOGLE_MAPS_API_KEY=your-key-here
//   6. Rebuild and re-upload.
//
// IF YOUR HOST FORCES THE VALUE TO UPPERCASE (this has been seen on some
// Hostinger accounts — the saved variable comes back as all-caps, which
// breaks the key since API keys are case-sensitive): set
// REACT_APP_GOOGLE_MAPS_API_KEY_HEX instead, using the hex-encoded key
// (only 0-9 and a-f, so forced uppercasing does nothing to it — the code
// below lowercases it before decoding regardless). Generate it once by
// running this in any browser's DevTools console, with your real key
// pasted in place of the placeholder:
//   [...new TextEncoder().encode("YOUR_REAL_KEY")].map(b => b.toString(16).padStart(2,'0')).join('')
// Paste the output as REACT_APP_GOOGLE_MAPS_API_KEY_HEX. If both variables
// are set, the plain REACT_APP_GOOGLE_MAPS_API_KEY takes priority.
//
// FINDING A PROPERTY'S PLACE ID: search for the property on
// https://developers.google.com/maps/documentation/places/web-service/place-id
// (Google's own "Place ID Finder" tool on that page) — this only works for
// a property that already has its own Google Business/Maps listing (most
// individual villas/homestays won't unless you've set one up for them).
//
// COST NOTE: Google includes a monthly free-usage credit, and usage
// beyond it is billed per request. A small property site's traffic
// typically stays well within the free tier, but it's worth keeping an
// eye on usage in the Google Cloud console, especially as traffic grows.
// ───────────────────────────────────────────────────────────────────────

function hexToString(hex) {
  const clean = hex.trim().toLowerCase().replace(/[^0-9a-f]/g, '');
  const bytes = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

const RAW_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const HEX_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY_HEX || '';
const API_KEY = RAW_KEY || (HEX_KEY ? hexToString(HEX_KEY) : '');

// Defines window.google.maps.importLibrary using Google's own officially
// recommended "inline bootstrap loader". This is deliberately NOT a plain
// <script src="...maps/api/js?..."> tag — that approach has a real race
// condition: with loading=async (required for good performance), the
// script's `load` event fires before Google's internal setup finishes, so
// `importLibrary` isn't reliably defined yet when `load` fires. This
// bootstrap snippet avoids that entirely: it defines `importLibrary`
// synchronously and handles fetching the real API lazily, internally,
// the first time it's actually called.
// Source: https://developers.google.com/maps/documentation/javascript/load-maps-js-api
function ensureGoogleMapsBootstrap() {
  if (window.google && window.google.maps && window.google.maps.importLibrary) return;

  ((g) => {
    let h; let a; let k; const p = 'The Google Maps JavaScript API'; const c = 'google';
    const l = 'importLibrary'; const q = '__ib__'; const m = document; let b = window;
    b = b[c] || (b[c] = {});
    const d = b.maps || (b.maps = {}); const r = new Set(); const e = new URLSearchParams();
    const u = () => h || (h = new Promise((f, n) => {
      (async () => {
        await (a = m.createElement('script'));
        e.set('libraries', [...r] + '');
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (k in g) e.set(k.replace(/[A-Z]/g, (t) => `_${t[0].toLowerCase()}`), g[k]);
        e.set('callback', `${c}.maps.${q}`);
        a.src = `https://maps.${c}apis.com/maps/api/js?${e}`;
        d[q] = f;
        a.onerror = () => { h = n(new Error(`${p} could not load.`)); };
        a.nonce = m.querySelector('script[nonce]')?.nonce || '';
        m.head.append(a);
      })();
    }));
    d[l] ? console.warn(`${p} only loads once. Ignoring:`, g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
  })({ key: API_KEY, v: 'weekly' });
}

// In-memory cache so the same Place ID isn't fetched twice on one page
// view (e.g. a property shown both in the grid and, once clicked, the modal).
const ratingCache = new Map();

/**
 * Fetches { rating, reviewCount } live from Google for a given Place ID.
 * Returns null (never throws to the caller) if not configured or if the
 * request fails, so callers can always safely fall back to manual data.
 */
export async function fetchGoogleRating(placeId) {
  if (!placeId) return null;
  if (!API_KEY) {
    // eslint-disable-next-line no-console
    console.warn(
      `Property has a googlePlaceId ("${placeId}") but REACT_APP_GOOGLE_MAPS_API_KEY ` +
      'is not set, so its rating will keep showing the manual value from listings.js. ' +
      'See the setup steps at the top of src/lib/googlePlaces.js.'
    );
    return null;
  }
  if (ratingCache.has(placeId)) return ratingCache.get(placeId);

  try {
    ensureGoogleMapsBootstrap();
    const { Place } = await window.google.maps.importLibrary('places');
    const place = new Place({ id: placeId });
    await place.fetchFields({ fields: ['rating', 'userRatingCount'] });

    const result = {
      rating: typeof place.rating === 'number' ? place.rating : null,
      reviewCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : null,
    };
    ratingCache.set(placeId, result);
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Could not fetch a live Google rating for place "${placeId}":`, err);
    return null;
  }
}

import { useEffect, useState } from 'react';
import { fetchGoogleRating } from './googlePlaces';

// ───────────────────────────────────────────────────────────────────────
// The year Curatd Concepts was founded. "Years in Business" is computed
// from this against today's date, so it stays correct on its own and
// never needs to be manually bumped every year.
// ───────────────────────────────────────────────────────────────────────
export const FOUNDED_YEAR = 2021;

/**
 * Computes the About page's stat bar directly from the same `listings`
 * array that powers the rest of the site (src/data/listings.js) instead
 * of a hardcoded marketing number. As properties are added to or removed
 * from that file, these numbers update automatically.
 *
 * Guest Satisfaction is the average rating across all listings, shown as
 * a percentage. For any listing with a `googlePlaceId` configured, its
 * live Google rating is used once it loads; otherwise (or while it's
 * still loading) the manually-entered `rating` from listings.js is used
 * — the same live-with-fallback pattern as useLiveRating.js, so nothing
 * ever shows blank or breaks if the Google Maps key isn't set up.
 */
export default function useLiveStats(listings) {
  const [liveRatings, setLiveRatings] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLiveRatings({});

    listings.forEach((listing) => {
      if (!listing.googlePlaceId) return;
      fetchGoogleRating(listing.googlePlaceId).then((result) => {
        if (!cancelled && result && result.rating != null) {
          setLiveRatings((prev) => ({ ...prev, [listing.hotelId]: result.rating }));
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [listings]);

  const propertiesManaged = listings.length;

  const destinations = new Set(
    listings.map((l) => (l.location.split(',')[0] || l.location).trim().toLowerCase())
  ).size;

  const ratings = listings
    .map((l) => (typeof liveRatings[l.hotelId] === 'number' ? liveRatings[l.hotelId] : l.rating))
    .filter((r) => typeof r === 'number');
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  const guestSatisfactionPct = avgRating != null ? Math.round((avgRating / 5) * 100) : null;

  const yearsInBusiness = Math.max(1, new Date().getFullYear() - FOUNDED_YEAR);

  const stats = [
    {
      value: `${propertiesManaged}${propertiesManaged >= 10 ? '+' : ''}`,
      label: propertiesManaged === 1 ? 'Property Managed' : 'Properties Managed',
    },
    {
      value: `${destinations}${destinations >= 10 ? '+' : ''}`,
      label: destinations === 1 ? 'Destination' : 'Destinations',
    },
    {
      value: guestSatisfactionPct != null ? `${guestSatisfactionPct}%` : '—',
      label: 'Guest Satisfaction',
    },
    {
      value: `${yearsInBusiness}+`,
      label: yearsInBusiness === 1 ? 'Year in Business' : 'Years in Business',
    },
  ];

  return {
    stats,
    propertiesManaged,
    destinations,
    guestSatisfactionPct,
    yearsInBusiness,
  };
}

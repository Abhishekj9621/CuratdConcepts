import { useEffect, useState } from 'react';
import { fetchGoogleRating } from './googlePlaces';

/**
 * Returns the rating/reviewCount to display for a listing: the live
 * Google value if the listing has a `googlePlaceId` and the fetch
 * succeeds, otherwise the rating/reviewCount entered by hand in
 * src/data/listings.js. Never leaves the UI blank while loading — it
 * shows the manual numbers first, then swaps in the live ones if/when
 * they arrive.
 */
export default function useLiveRating(listing) {
  const [live, setLive] = useState(null);
  const placeId = listing && listing.googlePlaceId;

  useEffect(() => {
    setLive(null);
    if (!placeId) return undefined;

    let cancelled = false;
    fetchGoogleRating(placeId).then((result) => {
      if (!cancelled && result && result.rating != null) setLive(result);
    });

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  return {
    rating: live ? live.rating : listing.rating,
    reviewCount: live ? live.reviewCount : listing.reviewCount,
    isLive: Boolean(live),
  };
}

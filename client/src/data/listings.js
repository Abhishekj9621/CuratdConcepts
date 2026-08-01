// ───────────────────────────────────────────────────────────────────────
// PROPERTY LISTINGS — edit this file to add, update, or remove properties
// ───────────────────────────────────────────────────────────────────────
// This is now the ONLY source of property data for the whole site (the
// Home page's "Featured Properties" and the full /listings page both read
// from this array). There is no external system to sync from — to change
// what visitors see, edit the array below, save, then rebuild the site
// (`npm run build`) and re-upload the `build` folder to Hostinger.
//
// To add a new property: copy one of the objects below, give it a unique
// `hotelId`, and fill in its details. To remove one, delete its object.
// To take a property down temporarily without deleting it, just comment
// its object out (wrap it in /* ... */).
//
// AIRBNB-ONLY BOOKING MODEL
// ─────────────────────────
// Every property books through Airbnb, in one or both of two ways:
//   1. As a WHOLE PLACE — one Airbnb listing for the entire property.
//      This uses the top-level `price` and `airbnbLink` fields below.
//   2. As INDIVIDUAL ROOMS — each room is its own separate Airbnb
//      listing with its own URL and price. This uses `roomTypes[]`,
//      where each room can have its own `airbnbLink`.
// A property can have just one of these, or both — e.g. a villa that's
// bookable as a whole place AND has some of its rooms bookable
// separately. Leave `airbnbLink` (top-level or on a room) empty/out if
// that particular way of booking isn't offered for this property.
//
// ON LIVE PRICING: Airbnb doesn't provide any way for a site like this
// to pull its current live price automatically — there's no public API
// for it. The `price` fields below are the numbers shown on this site;
// keep them updated by hand when your Airbnb price changes. The "Book on
// Airbnb" buttons take guests straight to the real listing, where
// Airbnb's own live price and availability are always accurate.
//
// FIELD REFERENCE
// ───────────────
// hotelId       (required) — a unique short id/slug, e.g. "coorg-villa-1"
// name          (required) — property name
// type          (required) — e.g. "Villa", "Homestay", "Beach Villa",
//                             "Bungalow", "Luxury Camp", "Chalet" (any
//                             text works — new types show up as filter
//                             tabs automatically)
// location      (required) — e.g. "Coorg, Karnataka"
// price         (required) — whole-property price per night, in ₹, number
// airbnbLink    (optional) — Airbnb URL for booking the WHOLE property.
//                             Leave out/empty if this property is only
//                             bookable room-by-room, not as a whole place.
// rating        (required) — number out of 5, e.g. 4.8
// reviewCount   (required) — number of reviews, e.g. 34
// guests        (required) — max guests, number
// bedrooms      (required) — number
// bathrooms     (required) — number
// images        (required) — array of photo URLs, first one is the cover
//                             photo. Use real photos of the real property.
// description   (optional) — shown on the card (short preview) and in the
//                             modal (full text, with a "Read more" toggle
//                             if it's long) — write as much as you like.
// amenities     (optional) — array of strings, e.g. ["Private Pool", "WiFi"]
// roomTypes     (optional) — array of individually-bookable rooms (see
//                             below) — only needed if any rooms are
//                             listed separately from the whole property.
// googlePlaceId (optional) — this property's Google Place ID. If set (and
//                             the site's Google Maps API key is configured
//                             — see src/lib/googlePlaces.js), the site
//                             shows this property's LIVE rating and review
//                             count straight from Google instead of the
//                             `rating`/`reviewCount` you typed below. Leave
//                             it out to just use the numbers you enter.
//
// Each roomTypes[] entry:
//   id            — unique id within the property, e.g. "rt-1"
//   name          — e.g. "Master Suite"
//   ac            — true/false
//   roomCount     — how many rooms of this type, number
//   maxOccupancy  — number
//   bedType       — e.g. "King", "Twin"
//   sizeSqft      — number (optional, omit if unknown)
//   amenities     — array of strings (optional)
//   price         — per-night price for this room, ₹, number (0 hides the
//                   price on the site rather than showing a made-up number)
//   airbnbLink    — (optional) Airbnb URL for booking THIS room on its
//                   own. Leave out/empty if this room isn't listed as a
//                   separate Airbnb listing.
// ───────────────────────────────────────────────────────────────────────
// NOTE: only 4 of Nirvana's 6 rooms are listed individually below — the
// other 2 will be added once their Airbnb links/details are ready.
// ───────────────────────────────────────────────────────────────────────

export const listings = [
  {
    hotelId: 'nirvana-stay-udaipur',
    name: 'Nirvana Stays',
    type: 'Apartment',
    location: 'Udaipur, Rajasthan',
    description:
      'Nirvana is a six-room heritage guesthouse in the heart of Udaipur\'s Old City, just steps from Jagdish Temple and City Palace. Every AC ensuite room comes with WiFi and a dedicated workspace, and the shared rooftop terrace offers stunning views of the City Palace, Old City lights, and the Aravalli Hills. Book a single room, or reserve the entire property for a group.',
    price: 8500,
    airbnbLink: '',
    rating: 4.8,
    reviewCount: 34,
    guests: 12,
    bedrooms: 6,
    bathrooms: 6,
    images: [
      "/property/nirvana-hero.jpg",
      "/property/nirvana-room-103-1.jpg",
      "/property/nirvana-room-103-2.jpg",
      "/property/nirvana-room-103-3.jpg",
      "/property/nirvana-room-103-4.jpg",
      "/property/nirvana-room-103-5.jpg",
      "/property/nirvana-room-105-1.jpg",
      "/property/nirvana-room-105-2.jpg",
      "/property/nirvana-room-105-3.jpg",
      "/property/nirvana-room-105-4.jpg",
      "/property/nirvana-room-105-5.jpg",
      "/property/nirvana-room-105-6.jpg",

      "/property/nirvana-common-1.jpg",
      "/property/nirvana-common-2.jpg",
      "/property/nirvana-common-3.jpg",
      "/property/nirvana-common-4.jpg",
      "/property/nirvana-common-5.jpg",
      "/property/nirvana-common-6.jpg"
    ],
    amenities: [
      'Air conditioning',
      'WiFi',
      'Hot water',
      'Dedicated workspace',
      'Kitchen',
      'TV',
      'Coffee maker',
      'Essentials',
      'Paid parking off premises',
    ],
    roomTypes: [
      {
        id: 'rt-1',
        name: 'Cozy Stay in Old City',
        ac: true,
        roomCount: 1,
        maxOccupancy: 2,
        bedType: 'Double Bed',
        sizeSqft: 350,
        amenities: ['AC', 'Attached Bath', 'Netflix'],
        price: 0,
        airbnbLink: 'https://airbnb.co.in/h/nirvana-cozystay',
      },
      {
        id: 'rt-2',
        name: 'Old City Escape',
        ac: true,
        roomCount: 1,
        maxOccupancy: 2,
        bedType: '',
        amenities: ['AC', 'Attached Bath'],
        price: 0,
        airbnbLink: 'https://airbnb.co.in/h/nirvana-oldcityescape',
      },
      {
        id: 'rt-3',
        name: 'Luxury Room with Rooftop Terrace',
        ac: true,
        roomCount: 1,
        maxOccupancy: 2,
        bedType: '',
        amenities: ['AC', 'Attached Bath'],
        price: 0,
        airbnbLink: 'https://airbnb.co.in/h/nirvana-luxuryroomwithrooftopterrace',
      },
      {
        id: 'rt-4',
        name: 'Modern Stay',
        ac: true,
        roomCount: 1,
        maxOccupancy: 2,
        bedType: '',
        amenities: ['AC', 'Attached Bath'],
        price: 0,
        airbnbLink: 'https://airbnb.co.in/h/nirvana-modern-stay',
      },
    ],
    googlePlaceId: 'ChIJkzW2JrPlZzkRh9hzEQbvquo',
  },
];
# Curatd Concepts — Website

A static React marketing site for **Curatd Concepts**, a premium property
management company that onboards and manages unique stays (villas,
homestays, bungalows, etc.) across India on platforms like Airbnb,
Booking.com, Agoda, and MakeMyTrip.

**This app has no backend of its own.** Property data (photos, room types,
amenities, pricing) and the contact form both go straight to your
**NovaStay HMS** backend's public API — the same system used to manage
bookings, staff, and operations. See the NovaStay HMS repo for that side of
things, and this repo's `DEPLOYMENT.md` for how the two connect.

```
Browser ──> this app (static React build)
                 │
                 ▼  REACT_APP_HMS_API_URL
        NovaStay HMS backend's public API
        (GET /public/listings, POST /public/contact)
```

---

## 📁 Project Structure

```
CuratdConcepts-updated/
├── client/               # The entire app — React frontend (Create React App)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/          # api.js — talks directly to the HMS's public API
│       ├── components/   # Navbar, Footer
│       ├── pages/        # Home, AboutUs, Listings, WhatWeDo, ContactUs
│       ├── App.js        # Routes
│       ├── index.js      # Entry point
│       └── index.css     # Global styles + CSS variables
├── package.json          # Root convenience scripts (delegate to client/)
├── DEPLOYMENT.md         # Step-by-step Vercel deploy guide
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A running NovaStay HMS backend (local or deployed) — see that repo's README

### 1. Install

```bash
npm run install-all
# or: cd client && npm install
```

### 2. Configure

```bash
cd client
cp .env.example .env
```

Set `REACT_APP_HMS_API_URL` to your HMS backend's API URL (e.g.
`http://localhost:4000/api/v1` for local dev, or your deployed
`https://api.curatdconcepts.com/api/v1`).

### 3. Run

```bash
npm run dev      # http://localhost:3000
```

That's it — there's no separate backend process to start for this repo.

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured listings, partnership models, testimonials |
| About Us | `/about` | Company story, values, team |
| What We Do | `/what-we-do` | Business models (Lease + Revenue Share), process, OTA platforms, FAQ |
| Listings | `/listings` | Full property grid with filters by type & platform, room-type/AC breakdown |
| Contact Us | `/contact` | Contact form + details |

There's no admin section in this app — publishing/editing properties
(photos, room types, amenities, ratings, OTA links) happens in the NovaStay
HMS's own management app (typically `management.curatdconcepts.com`).

---

## 🔌 What this app calls

| Method | Endpoint (on the HMS backend) | Description |
|--------|----------|-------------|
| GET | `/public/listings` | Every **published** property — photos, type, rooms, AC/Non-AC, amenities, rating, OTA links |
| POST | `/public/contact` | Contact form / partner inquiry submission → emails the HMS's configured inbox |

Both are genuinely public (no auth) — see the HMS repo's `docs/API.md` for
the exact response shape.

---

## 🎨 Design System

The site uses CSS custom properties defined in `client/src/index.css`:
- **Colors**: `--cream`, `--charcoal`, `--gold`, `--terracotta`, `--sage`
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Utilities**: `.btn-primary`, `.btn-outline`, `.section-label`, `.container`

---

## 🛠 Customization

- **Properties, photos, amenities, rooms**: managed entirely in the
  NovaStay HMS management app — nothing to edit here.
- **Company info**: update name, phone, email, social links in `Footer.js`
  and `ContactUs.js`.
- **Team**: edit the `team` array in `AboutUs.js`.

---

## 📦 Build for Production

```bash
npm run build
```

Builds the React app into `client/build/`.

---

## 🗺 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Vercel deployment guide,
including connecting to the HMS backend and custom domain setup.

---

Built with ❤️ for Curatd Concepts.

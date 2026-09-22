# Curatd Concepts — Website

A static React marketing site for **Curatd Concepts**, a premium property
management company that onboards and manages unique stays (villas,
homestays, bungalows, etc.) across India, booked entirely through Airbnb —
either as a whole property or by individual room, depending on the listing.

This site is fully self-contained — there's no backend, no database, and
nothing to connect to. Property listings live in one file in this project,
and the contact form sends email via [Web3Forms](https://web3forms.com).

---

## 📁 Project Structure

```
CuratdConcepts-main/
├── client/                    # The entire app — React (Create React App)
│   ├── public/
│   │   ├── index.html
│   │   └── .htaccess          # required for routing on Hostinger — keep this
│   └── src/
│       ├── data/
│       │   └── listings.js    # ← EDIT THIS to add/update/remove properties
│       ├── lib/
│       │   └── contactForm.js # contact form → Web3Forms (see setup below)
│       ├── components/        # Navbar, Footer
│       ├── pages/             # Home, AboutUs, Listings, WhatWeDo, ContactUs
│       ├── App.js             # Routes
│       └── index.js           # Entry point
├── package.json                # Root convenience scripts (delegate to client/)
└── README.md
```

---

## ✏️ Editing Content

### Properties
Everything shown on the Home page's "Featured Properties" and the full
`/listings` page comes from **`client/src/data/listings.js`**. Open that
file — it has a full field reference and comments at the top — and add,
edit, or remove property objects there. No other file needs to change.

### Contact form
The Contact Us form needs a one-time setup so submissions actually reach
your inbox:

1. Go to [web3forms.com](https://web3forms.com) and enter the email
   address that should receive enquiries — it emails you a free Access Key
   (no account signup required).
2. In `client/`, copy `.env.example` to a new file named `.env`.
3. Paste your key into `.env`:
   ```
   REACT_APP_WEB3FORMS_ACCESS_KEY=paste-your-key-here
   ```
4. Rebuild (see below) and re-upload to Hostinger.

Full details are in `client/src/lib/contactForm.js`.

### Live Google ratings (optional)
Any property can show its **live** rating and review count straight from
Google instead of a fixed number:
1. Set up a Google Maps API key — steps are in `client/src/lib/googlePlaces.js`.
2. Add that property's Google Place ID as `googlePlaceId` in
   `client/src/data/listings.js`.
Properties without a Place ID (or before the key is set up) just keep
showing the `rating`/`reviewCount` you typed in `listings.js` — nothing
breaks either way.

### Company info
Update phone, email, and social links in `Footer.js` and `ContactUs.js`.
Edit the `team` array in `AboutUs.js` to change team members.

---

## 🚀 Build & Deploy (Hostinger)

```bash
cd client
npm install
npm run build
```

This produces a `client/build/` folder — that's the entire website.

1. Log in to Hostinger → **File Manager** (or an FTP client).
2. Open your domain's `public_html` folder.
3. Upload **everything inside** `client/build/` (not the `build` folder
   itself — its *contents*) into `public_html`.
4. Make sure hidden files are shown/uploaded — `client/build/.htaccess`
   must be included, or every page except the homepage will 404 on
   refresh or direct link (this is already set up for you; it's copied
   into `build/` automatically by the build step above).
5. Visit your domain and check: the homepage loads, `/listings` shows your
   properties, and a test submission on `/contact` arrives in your inbox.

That's the whole deployment — no server process to keep running, and no
environment variables to set on Hostinger's side (the Web3Forms key gets
baked into the build in the step above).

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured listings, partnership models, testimonials |
| About Us | `/about` | Company story, values, team |
| What We Do | `/what-we-do` | Business models (Lease + Revenue Share), process, OTA platforms, FAQ |
| Listings | `/listings` | Full property grid with filters by type & platform, room-type/AC breakdown |
| Contact Us | `/contact` | Contact form + details |

---

## 🎨 Design System

CSS custom properties defined in `client/src/index.css`:
- **Colors**: `--cream`, `--charcoal`, `--gold`, `--terracotta`, `--sage`
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Utilities**: `.btn-primary`, `.btn-outline`, `.section-label`, `.container`

---

Built with ❤️ for Curatd Concepts.

# Curatd Concepts — Website

A full-stack React + Node.js website for **Curatd Concepts**, a premium property management company that onboards and manages unique stays (villas, homestays, bungalows, etc.) across India on platforms like Airbnb, Booking.com, Agoda, and MakeMyTrip.

---

## 📁 Project Structure

```
curatd-concepts/
├── client/               # React frontend (Create React App)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/          # Centralized fetch helper (api.js)
│       ├── components/   # Navbar, Footer, ProtectedRoute
│       ├── context/      # AuthContext (admin login state)
│       ├── pages/        # Home, AboutUs, Listings, WhatWeDo, ContactUs
│       │   └── admin/    # AdminLogin, AdminDashboard, ListingFormModal
│       ├── App.js        # Routes
│       ├── index.js      # Entry point
│       └── index.css     # Global styles + CSS variables
├── server/               # Node.js + Express backend
│   ├── data/             # listings.json — file-based data store
│   ├── middleware/        # JWT auth middleware
│   ├── routes/            # auth.js (login), listings.js (CRUD)
│   ├── scripts/           # generate-password-hash.js
│   ├── utils/             # listingsStore.js (read/write helpers)
│   ├── index.js           # Express app + route wiring
│   ├── .env.example        # Environment variables template
│   └── package.json
├── package.json          # Root scripts (runs both with concurrently)
├── DEPLOYMENT.md         # Step-by-step Vercel + Railway deploy guide
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Install Dependencies

```bash
# From the root folder, install all dependencies:
npm run install-all

# Or manually:
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:
- `ADMIN_USERNAME` — the username you'll use to log into `/admin`
- `ADMIN_PASSWORD_HASH` — generate with `node scripts/generate-password-hash.js "YourPassword"`
- `JWT_SECRET` — any long random string (e.g. `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- Email/SMTP details (optional, for the contact form)

### 3. Run in Development

```bash
# From the root:
npm run dev
```

This starts:
- **React frontend** at `http://localhost:3000`
- **Node.js backend** at `http://localhost:5000`

The React app proxies API calls to the server automatically.

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured listings, partnership models, testimonials |
| About Us | `/about` | Company story, values, team |
| What We Do | `/what-we-do` | Business models (Lease + Revenue Share), process, OTA platforms, FAQ |
| Listings | `/listings` | Full property grid with filters by type & platform |
| Contact Us | `/contact` | Contact form + details |
| Admin Login | `/admin/login` | Sign in to the admin portal |
| Admin Dashboard | `/admin` | Add, edit, and delete property listings (auth required) |

---

## 🔐 Admin Portal

A single admin account (configured via environment variables — no
sign-up flow) can log in at `/admin/login` to manage listings:

- **Add** new properties with name, type, location, pricing, amenities, etc.
- **Edit** any existing listing
- **Delete** listings with a confirmation step

Changes made in the admin portal immediately reflect on the public
`/listings` page and the homepage's featured properties section, since both
now fetch live data from the API instead of a hardcoded array.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for how to set the admin username and
password hash.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/listings` | — | All property listings |
| GET | `/api/listings/:id` | — | A single listing |
| POST | `/api/listings` | ✅ Admin | Create a listing |
| PUT | `/api/listings/:id` | ✅ Admin | Update a listing |
| DELETE | `/api/listings/:id` | ✅ Admin | Delete a listing |
| POST | `/api/admin/login` | — | Admin login (returns a JWT) |
| GET | `/api/admin/me` | ✅ Admin | Verify the current token |
| POST | `/api/contact` | — | Contact form submission |
| POST | `/api/partner` | — | Property owner partnership inquiry |

Admin-only endpoints require an `Authorization: Bearer <token>` header,
where `<token>` is returned by `/api/admin/login`.

---

## 🎨 Design System

The site uses CSS custom properties defined in `client/src/index.css`:
- **Colors**: `--cream`, `--charcoal`, `--gold`, `--terracotta`, `--sage`
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Utilities**: `.btn-primary`, `.btn-outline`, `.section-label`, `.container`

---

## 🛠 Customization

- **Replace images**: All images use Unsplash URLs. Replace with your actual property photos (paste a URL into the "Image URL" field in the admin portal, or in the listing data directly).
- **Update listings**: Use the admin portal at `/admin` — no code edits needed.
- **Contact form**: Configure SMTP in `server/.env` and uncomment the Nodemailer code in `server/index.js`.
- **Company info**: Update name, phone, email, social links in `Footer.js` and `ContactUs.js`.
- **Team**: Edit the `team` array in `AboutUs.js`.

---

## 📦 Build for Production

```bash
npm run build
```

This builds the React app into `client/build/`.

---

## 🗺 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a full step-by-step guide to
deploying the frontend to **Vercel** and the backend to **Railway**,
including setting up admin credentials and CORS.

---

Built with ❤️ for Curatd Concepts.

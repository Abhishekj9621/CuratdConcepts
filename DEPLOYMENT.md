# Deployment Guide — Vercel (Frontend) + Railway (Backend)

This project is a **monorepo**: `client/` (React) and `server/` (Express API +
admin portal backend) are deployed as two separate services.

```
Browser ──> Vercel (client/, static React build)
                 │
                 ▼  REACT_APP_API_URL
            Railway (server/, Node/Express API)
```

---

## 1. Before you deploy — set up admin credentials

The admin portal uses a single admin account defined entirely through
environment variables (no database/user table needed).

1. Pick a username (e.g. `admin`) and a strong password.
2. Generate a bcrypt hash of that password:
   ```bash
   cd server
   npm install
   node scripts/generate-password-hash.js "YourStrongPassword123"
   ```
3. Copy the printed hash — you'll paste it into Railway's environment
   variables as `ADMIN_PASSWORD_HASH` in step 3 below.
4. Generate a random JWT signing secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Save this for `JWT_SECRET`.

**Never commit your real password or these secrets to git.** Only
`.env.example` files are committed; your real `.env` stays local/in the
hosting dashboard.

---

## 2. Push the project to GitHub

Both Vercel and Railway deploy from a Git repository.

```bash
cd CuratdConcepts-main
git init
git add .
git commit -m "Initial commit"
gh repo create curatd-concepts --private --source=. --push
# (or create a repo on GitHub.com and `git remote add origin ...` + push)
```

---

## 3. Deploy the backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from
   GitHub repo** → select your repo.
2. After it's created, open the service **Settings** tab:
   - **Root Directory** → set to `server`
   - **Start Command** → `node index.js` (already set via `server/railway.json`)
3. Open the **Variables** tab and add:
   | Variable | Value |
   |---|---|
   | `PORT` | `5000` (Railway overrides this automatically, but it's fine to set) |
   | `NODE_ENV` | `production` |
   | `ADMIN_USERNAME` | your chosen username |
   | `ADMIN_PASSWORD_HASH` | the bcrypt hash from step 1 |
   | `JWT_SECRET` | the random secret from step 1 |
   | `CLIENT_URL` | your Vercel URL — you can update this after step 4, e.g. `https://curatd-concepts.vercel.app` |
4. Click **Deploy**. Once live, Railway gives you a public URL like
   `https://curatd-concepts-server.up.railway.app` — copy it, you'll need it
   for the frontend.
5. Test it: `curl https://your-railway-url.up.railway.app/api/health` should
   return `{"status":"ok", ...}`.

### A note on data persistence

Listings are stored in `server/data/listings.json` on disk, and uploaded
property images are stored in `server/uploads/`. Railway's
filesystem is **ephemeral on redeploys** — edits made through the admin
portal (including uploaded images) persist while the service is running, but
a new deploy will reset both back to what's in your repo. For a
portfolio/demo project this is usually fine. For real production use, either:
- Add a [Railway Volume](https://docs.railway.com/reference/volumes) mounted
  at `server/data` (and another at `server/uploads`) so they survive
  redeploys, **or**
- Swap `server/utils/listingsStore.js` for a real database (Postgres/Mongo)
  and uploads for a cloud storage bucket (S3, Cloudinary, etc.).

---

## 4. Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** →
   import the same GitHub repo.
2. In the import screen, set:
   - **Root Directory** → `client`
   - Framework Preset → Vercel should auto-detect **Create React App**
3. Add an environment variable:
   | Variable | Value |
   |---|---|
   | `REACT_APP_API_URL` | the Railway URL from step 3, e.g. `https://curatd-concepts-server.up.railway.app` (no trailing slash) |
4. Click **Deploy**. Vercel will build and give you a URL like
   `https://curatd-concepts.vercel.app`.

---

## 5. Connect the two — update CORS

Go back to **Railway → Variables** and set `CLIENT_URL` to your real Vercel
URL (comma-separate multiple origins if needed, e.g. for a custom domain
too):

```
CLIENT_URL=https://curatd-concepts.vercel.app
```

Railway will redeploy automatically. This is required — without it, the
browser will block API requests from your deployed frontend due to CORS.

---

## 6. Verify everything works

1. Visit your Vercel site → `/listings` should load properties from the live
   Railway API (not a static array).
2. Visit `https://your-vercel-url/admin/login` and sign in with the
   username/password you set in step 1.
3. Try adding, editing, and deleting a listing — confirm it shows up on the
   public `/listings` page and the homepage's featured section.
4. Log out and confirm `/admin` redirects you back to `/admin/login`.

---

## Local development

```bash
# Backend
cd server
cp .env.example .env
# fill in ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET
npm install
npm run dev          # http://localhost:5000

# Frontend (separate terminal)
cd client
npm install
npm start             # http://localhost:3000, proxies /api to localhost:5000
```

Then visit `http://localhost:3000/admin/login`.

# Deployment Guide — Vercel (static site only)

**This app has no backend of its own.** It's a static React site that reads
published listings and submits the contact form directly against your
NovaStay HMS backend's public API. All property management — photos, room
types, amenities, publishing, ratings, OTA links — happens in the HMS's own
management app, not here.

```
Browser ──> Vercel (this repo, static React build)
                 │
                 ▼  REACT_APP_HMS_API_URL
        NovaStay HMS backend (api.curatdconcepts.com)
```

If you haven't deployed the HMS backend yet, do that first — see
`DEPLOY_RAILWAY_VERCEL.md` in the NovaStay HMS repo. You'll need its URL
before step 3 below.

---

## 1. Push this project to GitHub

```bash
cd CuratdConcepts-updated
git init
git add .
git commit -m "Initial commit"
gh repo create curatd-concepts --private --source=. --push
# (or create a repo on GitHub.com and `git remote add origin ...` + push)
```

---

## 2. Deploy to Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import
   `curatd-concepts`.
2. **Root Directory** → `client`. Framework preset should auto-detect
   **Create React App**.
3. Environment variable:
   | Variable | Value |
   |---|---|
   | `REACT_APP_HMS_API_URL` | your deployed HMS backend's URL + `/api/v1`, e.g. `https://api.curatdconcepts.com/api/v1` |
4. Deploy. Vercel gives you a URL like `https://curatd-concepts.vercel.app`.

---

## 3. Point curatdconcepts.com at it (custom domain)

Vercel → your project → **Settings → Domains** → add `curatdconcepts.com`
(and `www.curatdconcepts.com` if you want both). Vercel shows you the exact
DNS records to add at your domain registrar — usually an `A` record for the
apex domain and a `CNAME` for `www`. Propagation is typically minutes to a
few hours.

---

## 4. Allow this domain through the HMS's CORS

Go to the **HMS backend's** Railway variables (not this project) and make
sure `CORS_ORIGINS` includes this site's real domain:

```
CORS_ORIGINS=https://curatdconcepts.com,https://management.curatdconcepts.com
```

Without this, the browser blocks every request this site makes to the HMS
API. See the HMS repo's `DEPLOY_RAILWAY_VERCEL.md` for the full picture.

---

## 5. Publish at least one listing

Nothing shows up on `/listings` until a hotel in the HMS has been marked
**Published** on its Website Listing tab (management app → Hotels → pick a
hotel → **Website** button). It needs at least one photo and one room type
to look like anything on the public site.

---

## 6. Verify everything works

1. Visit your domain → `/listings` should load the properties you published
   in step 5, with real photos and room types.
2. Open a listing — the Room Types section should show AC/Non-AC badges
   correctly (based on whether "AC" is in that room type's amenities in the
   HMS).
3. Submit the contact form → confirm the email arrives at whatever
   `CONTACT_INBOX_EMAIL` is set to on the HMS backend.
4. Un-publish that hotel's Website Listing in the management app → confirm
   it disappears from `/listings` (no redeploy needed — this is a live API
   call, not a cached copy).

---

## Local development

```bash
cd client
cp .env.example .env
# point REACT_APP_HMS_API_URL at a locally-running or deployed HMS backend
npm install
npm start          # http://localhost:3000
```

There's nothing else to run locally — no server, no database, no build
step beyond the React app itself.

# Deploying

Two pieces, deployed separately from the same repo.

---

## 1. Frontend → Vercel

**New Project → import the repo → set Root Directory to `frontend`.**

That single setting is what the failing build was missing. Vercel was
building from the repo root and finding no Next.js app.

Environment variables (Project → Settings → Environment Variables) — copy
every `NEXT_PUBLIC_*` line from `frontend/.env`, with one change:

```
NEXT_PUBLIC_API_URL = https://<your-backend-url>/api
```

Everything prefixed `NEXT_PUBLIC_` is compiled into the browser bundle and is
public by definition. Never put a secret behind that prefix.

---

## 2. Backend → Vercel

**New Project → same repo → Root Directory `backend`.**

`backend/vercel.json` and `backend/api/index.js` are already configured.
`server.js` exports the app instead of calling `listen()` when imported, so
Vercel mounts it as a serverless function.

Two things are handled for you:

- **Request body limit.** Vercel caps a serverless request body at 4.5 MB,
  enforced at the edge before Express runs. Uploads are capped at **2 MB**, and
  the browser downscales anything larger before sending, so a customer never
  meets that ceiling.
- **Connection reuse.** The Mongo connection is cached on `globalThis`, so a
  warm container reuses it instead of opening a new pool per request — which is
  what exhausts an Atlas connection limit under load.

If you ever outgrow serverless, the same code runs unchanged on Render or
Railway with Root Directory `backend`, build `npm install`, start `npm start`.

### Backend environment variables

Copy everything from `backend/.env` (see `.env.example`), then set:

```
CLIENT_ORIGIN = https://<your-frontend-domain>.vercel.app
```

Comma-separate to allow more than one origin. **If this does not match the
deployed frontend exactly, every browser request fails CORS** — which looks
identical to the backend being down.

---

## 3. After both are live

1. Set `NEXT_PUBLIC_API_URL` on Vercel to the backend URL, then redeploy the
   frontend. Next.js inlines `NEXT_PUBLIC_*` at build time, so changing it
   without redeploying has no effect.
2. Add the backend host to **MongoDB Atlas → Network Access**. Serverless
   platforms have no fixed IP, so this usually means `0.0.0.0/0`; rely on the
   database password rather than IP filtering.
3. Check `https://<backend>/api/health` returns `{"ok":true}`.
4. Run one real booking end to end and approve it, to confirm the Calendly
   lookup and the approval email both work in production.

---

## Notes

- `.env` files are gitignored and are **not** deployed. Every variable must be
  set in the hosting dashboard.
- The admin account is created or promoted on first boot from `ADMIN_PHONE`
  and `ADMIN_PASSWORD`. Change `ADMIN_PASSWORD` before going live.
- `trust proxy` is already enabled, so rate limiting sees real client IPs
  behind the platform's proxy rather than limiting everyone as one address.

# Tech Blog

A tech blog with Google sign-in. Anyone can read posts; signed-in users can write posts (with optional cover images) and edit or delete **their own** posts. Admins can moderate everything.

**Stack:** React · Tailwind CSS · Node.js · Express · MongoDB (Mongoose) · Google Identity Services · Vercel

## Features
- Google sign-up / sign-in (first sign-in creates the account)
- Create, view, edit, delete, search and paginate posts with cover images
- Ownership rules enforced on the server: users change only their own posts; admins (by email) change any
- Protected pages (`/create`, `/edit/:id`) that return you where you were after signing in

## How authentication works

1. The browser shows Google's sign-in button and receives a signed **ID token** from Google.
2. It sends the token to `POST /api/auth/google`. The server verifies the signature, expiry, audience (our client id) and that the email is verified, then finds or creates the user.
3. The server replies with its own **session** in an `httpOnly` cookie (a signed JWT, 7 days). JavaScript can't read it, which limits the damage of an XSS bug.
4. Every API request carries the cookie; the server loads the user and applies the rules (`requireAuth`, ownership checks).

Security decisions:
- Cookie is `httpOnly`, `Secure` in production and `SameSite=Lax`; state-changing requests from other origins are also rejected (`CLIENT_ORIGIN`).
- The browser only talks to the API through the front-end's own domain (proxy), so the cookie is first-party, works in Safari/Chrome with third-party cookies blocked, and there is no CORS surface at all.
- Authorization is decided on the server (the UI hiding buttons is only cosmetic). Sessions with a bad signature, wrong algorithm, or expiry are ignored.
- Internal ids (Google id) are never sent to the browser. API errors never leak stack traces in production.

Known limitations (deliberate, to keep it small): logout clears the cookie but a stolen token stays valid until it expires (add a token-version or session store to fix); no rate limiting on sign-in (add one at the edge/Vercel firewall); images are stored in MongoDB (fine for a portfolio; use object storage at scale).

## Project structure

```
client/                      React app (Create React App + Tailwind)
  src/
    api/                     axios instance + API calls (posts, auth)
    context/AuthContext      who is signed in, sign in/out, canModify()
    components/              Navbar, ContactUs, ProtectedRoute
    hooks/                   usePosts
    pages/                   Blogs, About, Create, EditPost, PostView, Login
server/                      Express API
  api/index.js               Vercel serverless entry
  src/
    app.js                   middleware + routes wiring
    config/                  env + cached MongoDB connection
    models/                  Post, User
    services/                postService, authService (Google), sessionService (JWT cookie)
    controllers/             HTTP layer
    routes/                  URL definitions
    middleware/              auth, originCheck, upload, errorHandler, validateObjectId
  scripts/                   one-off MySQL -> MongoDB migration
  tests/                     node:test (no database or network needed)
```

## 1. Google sign-in setup (once)

1. Go to <https://console.cloud.google.com>, create a project (e.g. `tech-blog`).
2. **APIs & Services → OAuth consent screen**: choose *External*, fill in the app name and your email. Under *Audience*, click **Publish app** so anyone can sign in (the basic scopes email/profile need no review). Left in "Testing", only listed test users can sign in.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application.**
   - *Authorized JavaScript origins*: `http://localhost:3000` (add your Vercel front-end URL later).
   - No redirect URIs are needed.
4. Copy the **Client ID**.

## 2. Run locally

Node 18+ and a MongoDB connection string (free Atlas M0 works).

```bash
# API
cd server
cp .env.example .env     # fill in MONGODB_URI, GOOGLE_CLIENT_ID, JWT_SECRET, ADMIN_EMAILS
openssl rand -hex 32     # run this and paste the output as JWT_SECRET
npm install
npm run dev              # http://localhost:5001

# React app (second terminal)
cd client
cp .env.example .env     # set REACT_APP_GOOGLE_CLIENT_ID (same client id)
npm install
npm start                # http://localhost:3000
```

Restart both after changing a `.env` file. Open http://localhost:3000 (not 5001), click **Sign in**.

## API

| Method | Route                  | Access          | Description                                        |
| ------ | ---------------------- | --------------- | -------------------------------------------------- |
| POST   | `/api/auth/google`     | public          | sign up / sign in with a Google ID token           |
| GET    | `/api/auth/me`         | public          | current user or `null`                             |
| POST   | `/api/auth/logout`     | public          | clear the session cookie                           |
| GET    | `/api/posts`           | public          | all posts                                          |
| GET    | `/api/posts/:id`       | public          | one post                                           |
| GET    | `/api/posts/:id/image` | public          | cover image                                        |
| POST   | `/api/posts`           | signed in       | create (multipart: title, content, author, image)  |
| PUT    | `/api/posts/:id`       | owner or admin  | update                                             |
| DELETE | `/api/posts/:id`       | owner or admin  | delete                                             |

Images: .jpg/.png, max 4MB (Vercel's request limit).

## 3. Deploy to Vercel (free)

Two Vercel projects from this one repo.

**API project** (Root Directory: `server`). Environment variables:
`MONGODB_URI`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `ADMIN_EMAILS`, and `CLIENT_ORIGIN` (the client URL, no trailing slash, once you have it).

**Client project** (Root Directory: `client`). Environment variable: `REACT_APP_GOOGLE_CLIENT_ID`.
Before deploying, edit `client/vercel.json` and replace `YOUR-API-PROJECT.vercel.app` with your API project's domain. This rewrite is what makes `/api/*` same-origin.

Then:
1. In Atlas → Network Access, allow `0.0.0.0/0`.
2. In Google Cloud → Credentials, add the client's Vercel URL to *Authorized JavaScript origins*.
3. Set `CLIENT_ORIGIN` on the API project and redeploy it.

## Moving data from the old MySQL version

Migrated posts have no owner, so only admins can edit/delete them.
1. Copy the old `back-end/uploads/` folder to `server/uploads/`
2. Add `MYSQL_URL` and `MONGODB_URI` to `server/.env`
3. `cd server && npm run migrate` (safe to re-run)

## Tests

```bash
cd server && npm test                          # sessions, auth flow, permissions, models
cd client && CI=true npm test -- --watchAll=false   # protected routes
```

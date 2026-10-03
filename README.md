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


## Tests

```bash
cd server && npm test                          # sessions, auth flow, permissions, models
cd client && CI=true npm test -- --watchAll=false   # protected routes
```

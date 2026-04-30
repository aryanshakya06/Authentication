# Authly

> A production-style **MERN authentication service** with email verification, JWT access + refresh rotation, Redis-backed single-active-session enforcement, CSRF protection, OTP-based 2FA, account lockout, password reset, and a polished React 19 + Tailwind v4 frontend.

![Node](https://img.shields.io/badge/node-%3E%3D20.19-brightgreen)
![React](https://img.shields.io/badge/react-19-61dafb)
![Express](https://img.shields.io/badge/express-5-000)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Highlights

- **Email verification before account creation.** Sign-up data is held in Redis under a one-shot 5-minute token; the user only lands in MongoDB after the verify link is clicked.
- **JWT access + refresh tokens with Redis-backed sessions.** 15-minute access, 7-day refresh, both as `httpOnly` cookies. A single active session per user is enforced — logging in elsewhere invalidates the previous session immediately.
- **OTP-based 2FA on every login.** Six-digit OTP, 5-minute window, max 5 attempts before a 15-minute lockout. Resend with a 60-second cooldown.
- **CSRF protection.** Double-submit cookie + custom header. Tokens auto-refresh through the axios interceptor.
- **Password reset flow.** Time-boxed Redis token, signs the user out of all devices on success.
- **Security middleware.** Helmet, compression, environment-aware cookies, global + per-auth-route rate limiting, request-id correlation, central error handler.
- **Senior-grade structure.** Clean `src/` layout, separation of routes / controllers / services / middleware / validators / templates / utils, ApiError class, asyncHandler that funnels into one error middleware.
- **Multi-theme UI (6 palettes).** `data-theme` attribute on `<html>` driven by CSS custom properties + Tailwind v4 `@theme inline`. Three light themes (Authly / Rose / Mint) and three dark (Purple Night / Midnight Blue / Obsidian). Persisted in `localStorage`, FOUC-free on reload via a blocking inline script.
- **Marketing-grade landing page.** Public hero with theme-aware gradient, code preview, features grid, "how it works" ladder, security checklist, stats, auth-aware CTAs.
- **Senior authenticated dashboard.** `/home` with stat grid, account info, current-session card, recent activity, security checklist, quick actions (rotate CSRF / change password / sign out), and an API explorer.
- **Polished frontend.** Reusable `Button` / `Input` / `PasswordInput` / `Spinner` / `FormCard`, `Navbar` (with `Themes` button) + `Footer` shell, `ErrorBoundary`, `ProtectedRoute` / `PublicOnlyRoute`, real OTP input with autofocus + numeric-only mask + resend cooldown timer, Inter font, accessible labels and focus rings.

## Tech stack

| Layer    | Tools                                                                    |
| -------- | ------------------------------------------------------------------------ |
| Backend  | Node.js, Express 5, Mongoose 8, Redis 5 client, JSON Web Tokens, bcrypt, Zod 4, Nodemailer, Helmet, express-rate-limit, mongo-sanitize |
| Frontend | React 19, Vite 7, Tailwind CSS 4, react-router v7, axios, react-toastify |
| Infra    | MongoDB (Atlas or local), Redis (Upstash or local), Gmail SMTP           |

## Architecture

```
+--------------+        +----------------------+        +-----------+
|   Browser    |  HTTPS |  Frontend (Vite SPA) |  XHR  |  Express  |
|  (React 19)  +------->+  - axios + interceptor+----->+  /api/v1  |
+--------------+        +----------------------+        +-----+-----+
                                                              |
                       +----------+    +-----------+    +-----v-----+
                       |  MongoDB |<---+  Mongoose +<---+ Controllers
                       |  (users) |    +-----------+    | + Services|
                       +----------+                     +-----+-----+
                                                              |
                       +----------+                     +-----v-----+
                       |  Redis   |<--------------------+ Sessions, |
                       | (Upstash)|                     | OTP, CSRF |
                       +----------+                     +-----+-----+
                                                              |
                                                        +-----v-----+
                                                        |   SMTP    |
                                                        | (Gmail)   |
                                                        +-----------+
```

Walk-throughs of the register, login, refresh, and reset flows live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Folder structure

```
Authentication/
├─ backend/
│  ├─ .env.example
│  ├─ scripts/gen-secrets.mjs        # generates JWT_SECRET + REFRESH_SECRET
│  └─ src/
│     ├─ app.js                      # express app (no listen)
│     ├─ server.js                   # entrypoint: validate env -> connect -> listen
│     ├─ config/                     # env, db, redis, mailer
│     ├─ constants/                  # cookies, http status
│     ├─ controllers/                # auth.controller, admin.controller
│     ├─ middlewares/                # auth, csrf, asyncHandler, error, rateLimit, requestId
│     ├─ models/                     # user.model
│     ├─ routes/                     # index, auth.routes, admin.routes
│     ├─ services/                   # email.service, token.service
│     ├─ templates/                  # emails (HTML)
│     ├─ utils/                      # apiError, logger
│     └─ validators/                 # auth.validator (Zod)
├─ frontend/
│  ├─ .env.example
│  ├─ scripts/smoke-test.mjs         # 16-assertion smoke (theme registry + FOUC + built CSS)
│  └─ src/
│     ├─ App.jsx, main.jsx, index.css
│     ├─ components/                 # ui/, layout/, ErrorBoundary, ProtectedRoute, ThemePicker
│     ├─ config/env.js
│     ├─ context/                    # AppContext, ThemeContext
│     ├─ hooks/                      # useAuth, usePageTitle
│     ├─ lib/                        # api (axios), errors (toast helper)
│     ├─ pages/                      # Landing, Home (dashboard), Login, Register, VerifyOTP,
│     │                              # Verify, Forgot/Reset, Dashboard (admin), NotFound
│     ├─ routes/AppRoutes.jsx
│     └─ styles/themes/              # _base, authly, rose, mint, purple-night, midnight-blue, obsidian + index.js
└─ docs/
   ├─ API.md
   ├─ ARCHITECTURE.md
   └─ SECURITY.md
```

## Getting started

### Prerequisites

- **Node.js 20.19+** (Vite 7 requires it)
- **MongoDB** running locally on `mongodb://localhost:27017` *or* a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Redis** running locally on `redis://localhost:6379` *or* a free [Upstash Redis](https://upstash.com) instance (TLS uses `rediss://`)
- **Gmail App Password** (Account → Security → 2-Step Verification → App passwords) for SMTP

### 1. Backend

```bash
cd backend
cp .env.example .env
npm run gen-secrets           # paste the printed values into .env
# fill MONGODB_URI, REDIS_URL, FRONTEND_URL, SMTP_USER, SMTP_PASS
npm install
npm run dev
```

The server boots on `http://localhost:5000`. Hit `http://localhost:5000/api/v1/health` — you should see `{ "status": "ok", "mongo": "ok", "redis": "ok" }`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run verify        # one-shot: lint + build + smoke (16 assertions)
npm run dev
```

Open `http://localhost:5173` — that's the public **landing page**. Click **Themes** in the top-right to flip between the 6 palettes.

### 3. End-to-end demo flow

1. **Land on `/`** — public landing page; click **Themes** to switch palettes.
2. **Register** — creates a Redis-held pending sign-up and emails a 5-minute verification link.
3. Click the email link — the account lands in MongoDB and you bounce to **Sign in**.
4. **Login** — credentials are checked, then a 6-digit OTP is mailed (5-minute window).
5. **Enter OTP** — on success you receive `accessToken`, `refreshToken`, and `csrfToken` cookies and are dropped on `/home` (the senior dashboard).
6. (As admin) Visit `/dashboard` to see the total user count.
7. **Forgot password** → email the reset link → set a new password → all sessions are invalidated.

### Frontend scripts

| Command           | Purpose                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| `npm run dev`     | Vite dev server with HMR                                                 |
| `npm run build`   | Production bundle to `dist/`                                             |
| `npm run preview` | Serve the built bundle                                                   |
| `npm run lint`    | ESLint                                                                   |
| `npm run smoke`   | 16-assertion smoke test (theme registry, FOUC inline script, built CSS)  |
| `npm run verify`  | `lint` + `build` + `smoke`. One-shot CI gate.                            |

## Theming

Authly ships **6 themes** (3 dark + 3 light) selectable from the **Themes** button in the navbar.

| Theme            | Mode  | Accent          | Use case                          |
| ---------------- | ----- | --------------- | --------------------------------- |
| `authly`         | light | Indigo 600      | Default — clean, neutral          |
| `rose`           | light | Rose 600        | Pinkish, warm                     |
| `mint`           | light | Teal 500        | Fresh, calm                       |
| `purple-night`   | dark  | Fuchsia 500     | Modern dark with magenta pop      |
| `midnight-blue`  | dark  | Cyan 500        | Modern dark with bluish tone      |
| `obsidian`       | dark  | Pure white      | High-contrast monochrome          |

Architecture (CSS-only, no new deps):

- Activation: `data-theme="..."` on `<html>` set BEFORE first paint by an inline script in `index.html` (reads `localStorage["authly:theme"]`, falls back to default — zero FOUC on reload).
- Tokens: CSS custom properties (`--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--line`, `--brand`, `--on-brand`, `--hero-grad`, etc.) declared once per theme under `[data-theme="<id>"]`.
- Tailwind glue: `@theme inline { --color-page: var(--bg); ... }` exposes the variables as Tailwind utilities (`bg-page`, `bg-card`, `text-fg`, `bg-brand`, `text-on-brand`, ...).
- Registry + state: `src/styles/themes/index.js` is the single source of truth; `ThemeProvider` + `useTheme()` persist the choice.
- Switcher: `ThemePicker.jsx` — swatch-grid modal grouped Dark / Light, instant-apply, no Save button.

Adding a 7th theme: drop a CSS file in `src/styles/themes/`, add an entry to `THEMES` in `index.js`, and add the id to the `VALID` array in the inline script in `index.html`. The smoke test catches step 3 omissions.

## Environment variables

### Backend (`backend/.env`)

| Name            | Required | Description                                              | Example                        |
| --------------- | -------- | -------------------------------------------------------- | ------------------------------ |
| `NODE_ENV`      | -        | `development` (default) or `production`                  | `development`                  |
| `PORT`          | yes      | HTTP port for the API                                     | `5000`                         |
| `APP_NAME`      | -        | Brand shown in emails / UI                                | `Authly`                       |
| `FRONTEND_URL`  | yes      | CORS origin and base for verify/reset links               | `http://localhost:5173`        |
| `MONGODB_URI`   | yes      | Mongo connection string                                   | `mongodb+srv://…`              |
| `REDIS_URL`     | yes      | Redis connection string (use `rediss://` for TLS)        | `redis://localhost:6379`       |
| `SMTP_USER`     | yes      | Gmail address for sending mail                            | `you@gmail.com`                |
| `SMTP_PASS`     | yes      | Gmail **app password** (NOT your account password)        | 16 chars                       |
| `JWT_SECRET`    | yes      | 64-byte hex; sign access tokens                           | `npm run gen-secrets` output    |
| `REFRESH_SECRET`| yes      | 64-byte hex; sign refresh tokens (must differ from JWT)   | `npm run gen-secrets` output    |

### Frontend (`frontend/.env`)

| Name             | Required | Description                                  | Example                  |
| ---------------- | -------- | -------------------------------------------- | ------------------------ |
| `VITE_API_URL`   | yes      | Backend base URL (no trailing slash)         | `http://localhost:5000`  |
| `VITE_APP_NAME`  | -        | Brand shown in navbar / page titles          | `Authly`                 |

## Documentation

- [API reference](docs/API.md) — every endpoint with payloads + error codes
- [Architecture](docs/ARCHITECTURE.md) — request flows for register / login / refresh / reset
- [Security notes](docs/SECURITY.md) — defenses, threat model, rotation checklist

## Pages

| Path                          | Auth                  | Description                                                          |
| ----------------------------- | --------------------- | -------------------------------------------------------------------- |
| `/`                           | public (auth-aware)   | Marketing landing: hero, features, "how it works", security, stats   |
| `/home`                       | protected             | Senior dashboard: stats, account, session, activity, quick actions   |
| `/login`                      | public-only           | Email + password (then OTP)                                          |
| `/register`                   | public-only           | Sign up                                                              |
| `/verify-otp`                 | public-only           | Six-digit OTP entry, autofocus, 60s resend cooldown                  |
| `/token/:token`               | public-only           | Email verification landing                                           |
| `/forgot-password`            | public-only           | Request a reset link                                                 |
| `/reset-password/:token`      | public-only           | Set a new password                                                   |
| `/dashboard`                  | protected (admin)     | Total users + system status                                          |
| `*`                           | public                | 404                                                                   |

## Roadmap

- Per-device session list + remote sign-out
- WebAuthn / passkey support as a stronger 2FA factor
- Optional Docker Compose for one-shot local dev
- Server-side audit log of auth events
- Internationalized email templates
- 7th theme (e.g. high-contrast accessibility variant)

## License

[MIT](LICENSE) © 2026 [Aryan Shakya](https://github.com/aryanshakya06)

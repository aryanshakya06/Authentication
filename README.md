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
- **Polished frontend.** Reusable `Button` / `Input` / `PasswordInput` / `Spinner` / `FormCard`, `Navbar` + `Footer` shell, `ErrorBoundary`, `ProtectedRoute` / `PublicOnlyRoute`, real OTP input with autofocus + numeric-only mask + resend cooldown timer, Inter font, accessible labels and focus rings.

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
│  └─ src/
│     ├─ App.jsx, main.jsx, index.css
│     ├─ components/                 # ui/, layout/, ErrorBoundary, ProtectedRoute
│     ├─ config/env.js
│     ├─ context/AppContext.jsx
│     ├─ hooks/                      # useAuth, usePageTitle
│     ├─ lib/                        # api (axios), errors (toast helper)
│     ├─ pages/                      # Home, Login, Register, VerifyOTP, Verify, Forgot/Reset, Dashboard, NotFound
│     └─ routes/AppRoutes.jsx
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
npm run dev
```

Open `http://localhost:5173`.

### 3. End-to-end demo flow

1. **Register** — creates a Redis-held pending sign-up and emails a 5-minute verification link.
2. Click the email link — the account lands in MongoDB and you bounce to **Sign in**.
3. **Login** — credentials are checked, then a 6-digit OTP is mailed (5-minute window).
4. **Enter OTP** — on success you receive `accessToken`, `refreshToken`, and `csrfToken` cookies and are dropped on the home page.
5. (As admin) Visit `/dashboard` to see the total user count.
6. **Forgot password** → email the reset link → set a new password → all sessions are invalidated.

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

## Roadmap

- Per-device session list + remote sign-out
- WebAuthn / passkey support as a stronger 2FA factor
- Optional Docker Compose for one-shot local dev
- Server-side audit log of auth events
- Internationalized email templates

## License

[MIT](LICENSE) © 2026 [Aryan Shakya](https://github.com/aryanshakya06)

# Architecture

Authly is split into a single Express API and a Vite-built React SPA. State
that must persist between requests lives in **MongoDB** (long-term, users)
and **Redis** (short-term, sessions, OTPs, CSRF tokens, rate-limit counters,
pending-signup blobs, password-reset tokens, OTP-attempt counters).

## Request flows

### 1. Register + email verify

```
Browser                Frontend         Express                 Redis        SMTP    Mongo
   |  POST /register       |               |                       |           |       |
   |---------------------->|---------- POST /api/v1/register ----->|           |       |
   |                       |               |  hash password (bcrypt 10)                |
   |                       |               |  random verifyToken (32 bytes hex)        |
   |                       |               |  SET verify:<token> = {name,email,hash}   |
   |                       |               |  EX 300                                   |
   |                       |               |--- store --------------> |                |
   |                       |               |--- send email --------------------> |     |
   |                       |               |                       |           |       |
   |  click link in email                                                           |
   |  GET /token/<verifyToken>                                                       |
   |---------------------->|--------- POST /api/v1/verify/:token ->|           |       |
   |                       |               |  GET verify:<token>   |           |       |
   |                       |               |<------ {data} --------|           |       |
   |                       |               |  DEL verify:<token>   |           |       |
   |                       |               |  User.create()        ----------->|------>|
   |                       |               |<------ user ----------------------|       |
   |  201 user                              |                       |           |       |
```

### 2. Login + OTP

```
Browser                 Frontend          Express              Redis        SMTP
   |  POST /login            |                |                  |           |
   |------------------------>|---- POST /api/v1/login --------->|           |
   |                         |                |  bcrypt compare                  |
   |                         |                |  random 6-digit OTP              |
   |                         |                |  SET otp:<email>=otp EX 300      |
   |                         |                |  DEL otp-attempts:<email>        |
   |                         |                |  send OTP email -----------> |   |
   |                         |                |                  |           |
   |  POST /verify {email,otp}                |                  |           |
   |------------------------>|---- POST /api/v1/verify -------->|           |
   |                         |                |  GET otp:<email>                  |
   |                         |                |  if mismatch INCR otp-attempts:*  |
   |                         |                |    if >= 5  -> SET otp-lockout:*  |
   |                         |                |               EX 900              |
   |                         |                |  if match                         |
   |                         |                |    DEL otp:* + otp-attempts:*      |
   |                         |                |    sign accessToken (15m)          |
   |                         |                |    sign refreshToken (7d)          |
   |                         |                |    if existing active_session, invalidate previous
   |                         |                |    SET refresh_token:<uid>         |
   |                         |                |    SET active_session:<uid>=sid    |
   |                         |                |    SET session:<sid>={metadata}    |
   |                         |                |    generate csrfToken              |
   |                         |                |    set 3 cookies + return user     |
```

### 3. Refresh

```
Browser            Express                                 Redis
  XHR fails 401 ACCESS_TOKEN_EXPIRED
  axios interceptor catches
  POST /api/v1/refresh
  -------------------->
                       verifyRefreshToken(refreshCookie)
                       jwt.verify -> {id, sessionId}
                       GET refresh_token:<uid> === cookie?
                       GET active_session:<uid> === sessionId?
                       GET session:<sid>?
                       update lastActivity
                       sign fresh access token (15m)
                       set accessToken cookie
                       <----------- 200
  axios retries the original request
```

If any check fails, the API returns 401 `SESSION_EXPIRED`, clears all
auth cookies, and the frontend bounces to `/login`.

### 4. Forgot / reset password

```
Browser                  Express                  Redis       SMTP
  POST /forgot-password  -->
                          rate-limit per ip+email
                          User.findOne(email)
                          random resetToken (32 bytes hex)
                          SET reset:<token> = userId EX 900
                          send reset email ------------->
  <-- 200 (always, never reveals account existence)

  POST /reset-password/:token  -->
                          GET reset:<token>
                          bcrypt.hash(new password)
                          user.save()
                          DEL reset:<token>
                          revokeRefreshToken(uid)   # signs out everywhere
  <-- 200
```

## Why Redis?

| Concern                     | Why it lives in Redis                                      |
| --------------------------- | ----------------------------------------------------------- |
| Pending sign-ups            | Self-expiring 5-minute store. No zombie unverified users    |
| Sessions and refresh tokens | Server-side revocation, single-active-session enforcement   |
| CSRF token                  | TTL'd, replaceable per session                              |
| OTPs and attempt counters   | Cheap atomic INCR and EXPIRE                                |
| Per-IP rate limiting        | High-throughput counters with TTLs                          |
| Password reset tokens       | One-shot, short-lived, unguessable                          |

## Cookie layout

| Cookie         | Purpose                          | TTL    | httpOnly | secure / sameSite                  |
| -------------- | -------------------------------- | ------ | -------- | ---------------------------------- |
| `accessToken`  | JWT, sent on every request       | 15 min | yes      | env-aware (none+secure prod / lax+http dev) |
| `refreshToken` | JWT, sent only to /refresh logic | 7 d    | yes      | same                               |
| `csrfToken`    | Read by frontend, echoed in header | 1 h  | **no**   | same                               |

## Frontend theming

Multi-theme is implemented entirely in CSS. No React rerenders for color
changes, no JS color branching, no new dependencies.

```
On first visit or on every reload

   <html>          index.html (head)
   ------          -----------------
                       |
                       v
            blocking inline <script>
            ------------------------
            const stored = localStorage["authly:theme"]
            const pick   = stored in VALID ? stored : "purple-night"
            document.documentElement.setAttribute("data-theme", pick)
                       |
                       v
                 first paint
                 -----------
            CSS [data-theme="<pick>"] block applies
            page paints with the right tokens immediately

When the user clicks a theme card

   ThemePicker.jsx -- setTheme(id) --> ThemeContext
                                          |
                                          v
                              localStorage.setItem("authly:theme", id)
                              <html data-theme={id}>
                                          |
                                          v
                              every CSS var cascades. Instant repaint.
```

Tokens declared per theme:

```
--bg, --bg-elev, --bg-input, --bg-muted     # backgrounds (page, card, input, subtle)
--fg, --fg-muted, --fg-faint                # text (primary, secondary, tertiary)
--line, --line-strong                       # borders
--brand, --brand-hover, --brand-soft        # primary accent + hover + tinted bg
--on-brand                                  # text/icon color on top of --brand
--success, --danger, --warning              # semantic
--ring                                      # focus ring
--hero-grad                                 # the gradient used in hero/banner
```

Components in `src/index.css` use these tokens directly through plain CSS
classes (`.btn`, `.btn--primary`, `.form-card`, `.welcome`, `.tile`, etc.).
There is no UI framework, no preprocessor, and no utility-class system.
JSX references the class names by hand.

Adding a 7th theme is three steps. A new CSS file, a registry entry, and
the id in the inline-script `VALID` array. The smoke test
(`npm run smoke` from `frontend/`) catches missing pieces.

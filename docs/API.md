# API Reference

Base URL: `http://localhost:5000/api/v1`

All POST/PUT/PATCH/DELETE requests on protected endpoints must send the
`x-csrf-token` header. The frontend `axios` instance does this automatically;
clients integrating manually must read the `csrfToken` cookie value and copy
it into that header.

All responses share a JSON envelope:

```json
{ "success": true,  "message": "...", "data": { } }
{ "success": false, "message": "...", "code": "..." }
```

Errors include a `requestId` field that matches the `X-Request-Id` response
header — useful for log correlation.

---

## Health

### `GET /health`

Auth: **no**

```json
{
  "status": "ok",
  "uptime": 12.4,
  "mongo": "ok",
  "redis": "ok",
  "timestamp": "2026-04-29T..."
}
```

`503` is returned with `status: "degraded"` if Mongo or Redis is down.

---

## Auth

### `POST /register`

Auth: **no**. Creates a 5-minute pending sign-up in Redis and emails a
verification link. The user record is **not** in MongoDB until the link
is clicked.

Request:
```json
{ "name": "Alice", "email": "alice@example.com", "password": "Strong#123" }
```

Success `200`:
```json
{ "success": true, "message": "Verification link sent to alice@example.com..." }
```

Error codes:
- `400 VALIDATION_FAILED` — Zod validation issue (weak password, bad name, etc.)
- `409 USER_EXISTS`
- `429 RATE_LIMITED` — repeat attempt within 60s
- `502 EMAIL_SEND_FAILED`

### `POST /verify/:token`

Auth: **no**. Consumes the verification token and creates the MongoDB user.

Success `201`:
```json
{
  "success": true,
  "message": "Email verified successfully...",
  "user": { "_id": "...", "name": "...", "email": "..." }
}
```

Error codes: `400 TOKEN_REQUIRED`, `400 VERIFY_LINK_EXPIRED`, `409 USER_EXISTS`.

### `POST /resend-verification`

Auth: **no**. Best-effort; never reveals account existence.

### `POST /login`

Auth: **no**. Validates credentials, mails a 6-digit OTP, returns immediately
(no auth cookies yet — those land after `/verify`).

Request:
```json
{ "email": "alice@example.com", "password": "Strong#123" }
```

Error codes: `400 VALIDATION_FAILED`, `400 INVALID_CREDENTIALS`,
`429 RATE_LIMITED`, `429 ACCOUNT_LOCKED`, `502 EMAIL_SEND_FAILED`.

### `POST /verify`  (verify OTP)

Auth: **no**. Trades a valid OTP for `accessToken` (15m), `refreshToken` (7d),
and `csrfToken` (1h) cookies, plus the user object.

Request:
```json
{ "email": "alice@example.com", "otp": "123456" }
```

Success `200`:
```json
{
  "success": true,
  "message": "Welcome, Alice",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" },
  "sessionInfo": {
    "sessionId": "...",
    "loginTime": "2026-04-29T...",
    "csrfToken": "..."
  }
}
```

Error codes:
- `400 MISSING_FIELDS`, `400 INVALID_PAYLOAD`
- `400 OTP_EXPIRED`
- `400 INVALID_OTP` — message includes remaining attempts
- `429 ACCOUNT_LOCKED` — after 5 wrong attempts; 15-minute lockout
- `400 USER_NOT_FOUND`

### `POST /resend-otp`

Auth: **no**. Sends a fresh OTP (60-second cooldown). Never reveals account existence.

### `POST /forgot-password`

Auth: **no**. Always responds with success (does not leak account existence).
If the email is registered, a 15-minute reset link is mailed.

### `POST /reset-password/:token`

Auth: **no**. Body: `{ "password": "NewStrong#123" }`. On success, all
existing sessions for the user are revoked.

### `GET /me`

Auth: **yes (access cookie + valid session)**.

Success:
```json
{
  "success": true,
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" },
  "sessionInfo": { "sessionId": "...", "loginTime": "...", "lastActivity": "..." }
}
```

Error codes: `401 NOT_AUTHENTICATED`, `401 ACCESS_TOKEN_EXPIRED`,
`401 ACCESS_TOKEN_INVALID`, `401 SESSION_EXPIRED`, `401 USER_NOT_FOUND`.

### `POST /refresh`

Auth: **refresh cookie only**. Issues a fresh access token cookie.

Error: `401 SESSION_EXPIRED` (cookies are cleared).

### `POST /logout`

Auth: **yes + CSRF**. Revokes the active session, clears all auth cookies,
busts the user cache.

### `POST /refresh-csrf`

Auth: **yes**. Rotates and returns a new CSRF token.

---

## Admin

### `GET /admin`

Auth: **yes + role=admin**.

```json
{ "success": true, "message": "Hello Admin, Alice", "data": { "totalUsers": 42 } }
```

Errors: `401 NOT_AUTHENTICATED`, `403 FORBIDDEN`.

# Security Notes

## Defenses in place

| Concern                            | Defense                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| Credential leak on disk            | All secrets via env. `backend/.env` is gitignored. `.env.example` contains no secrets. |
| MongoDB operator injection         | `mongo-sanitize` runs on every `req.body` in auth controllers.                          |
| Weak passwords                     | Zod regex enforces 8+ chars with upper, lower, number and symbol.                      |
| Brute-force login                  | Per-(IP,email) Redis rate-limit on register and login, plus global `express-rate-limit`. |
| Brute-force OTP                    | Max 5 attempts per OTP. The 5th wrong attempt locks the account for 15 minutes.        |
| Token theft via XSS                | `accessToken` and `refreshToken` cookies are `httpOnly`. No auth state in localStorage. |
| CSRF                               | Double-submit cookie plus custom header (`x-csrf-token`), enforced on every mutation route. |
| Session hijacking                  | Single-active-session. A fresh login deletes any other session for that user.          |
| Replay of revoked tokens           | Refresh tokens are stored in Redis and compared on `/refresh`. Revoked equals unusable.|
| Email enumeration                  | `forgot-password`, `resend-otp`, and `resend-verification` all reply with the same message regardless of whether the email exists. |
| Common HTTP attack vectors         | `helmet()` sets HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, etc.   |
| Slow or oversized request abuse    | `express.json({ limit: "100kb" })` plus `compression()`.                               |
| Cookie leakage cross-site          | Cookies are `secure + sameSite=none` in production (HTTPS only).                       |
| Stale debug logs in prod           | `morgan('dev')` only loaded when `NODE_ENV !== 'production'`.                          |
| Lost request context in incidents  | Every response carries `X-Request-Id`. The central error handler logs it with the error. |
| Server starting in a broken state  | `validateEnv()` plus fail-fast on Mongo and Redis connect errors.                      |

## Known limitations and future work

- **No SMTP-level rate enforcement.** Gmail throttles us, but a determined attacker on a residential ISP could trigger many emails. Add per-account daily limits on top of the per-(IP,email) timer.
- **OTP comparison uses `!==`, not a constant-time comparison.** OTP is a short numeric secret with a 5-attempt budget, so timing-attack feasibility is low. `crypto.timingSafeEqual` would still be better.
- **No device tracking.** Single-active-session means *the most recent device wins*. We don't display "previous session was on Chrome on Mac at IP x.x.x.x" to the user.
- **No audit log.** Auth events (login success, failed OTP, password reset) aren't persisted to a queryable store.
- **No backup MFA channel.** A user who loses access to their email is locked out.
- **Refresh token isn't rotated on every refresh.** Today `/refresh` only re-issues the access token. A stronger pattern is to rotate the refresh token too (with a one-shot reuse-detection store).

## Credential rotation checklist

If you ever accidentally leak the live `.env` (or just want to rotate
periodically), do the following.

1. **MongoDB Atlas**. Database Access -> edit user -> set new password -> update `MONGODB_URI`.
2. **Upstash Redis**. Database -> Reset password -> update `REDIS_URL`.
3. **Gmail App Password**. Account -> Security -> 2-Step Verification -> App passwords -> revoke old, create new -> update `SMTP_PASS`.
4. **JWT secrets**. Run `npm run gen-secrets` in `backend/`, paste both lines into `.env`. Both values must be different from each other and 64 bytes.
5. Restart the API. All existing sessions (signed by the old `JWT_SECRET` and `REFRESH_SECRET`) will fail verification, forcing every user to log in again. This is intentional after a key rotation.
6. Verify nothing slipped into git. `git ls-files | grep -F .env` should print only the `.env.example` files.

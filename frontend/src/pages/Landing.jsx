import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Button } from "../components/ui/Button.jsx";

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
    </svg>
);
const KeyIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="3.5" /><path d="M10 13l8-8" /><path d="M15 5l3 3" /><path d="M18 2l3 3" />
    </svg>
);
const MailIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
    </svg>
);
const RefreshIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" /><path d="M3 21v-5h5" />
    </svg>
);
const LockIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
);
const BoltIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" />
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Feature = ({ icon, title, body }) => (
    <div className="feature-card">
        <span className="feature-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{body}</p>
    </div>
);

const Stat = ({ value, label }) => (
    <div className="stat-card">
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
    </div>
);

const Landing = () => {
    const { isAuth, user } = useAuth();

    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div className="hero__glow" aria-hidden />
                <div className="hero__inner">
                    <div>
                        <span className="tag"><span className="tag__dot" /> MERN authentication, batteries included</span>
                        <h1 className="h-display" style={{ marginTop: 20 }}>
                            Authentication that&apos;s{" "}
                            <span className="gradient-text">secure by default</span>
                        </h1>
                        <p className="lead" style={{ marginTop: 20, maxWidth: 580 }}>
                            Email verification, JWT access &amp; refresh rotation, Redis-backed single-active-session
                            enforcement, double-submit CSRF, OTP-based 2FA on every login, and password reset &mdash;
                            all in one tightly-tested stack you can read, audit, and ship.
                        </p>
                        <div className="cta-row">
                            {isAuth ? (
                                <Link to="/home"><Button size="lg">Open your dashboard &rarr;</Button></Link>
                            ) : (
                                <>
                                    <Link to="/register"><Button size="lg">Get started &mdash; it&apos;s free</Button></Link>
                                    <Link to="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
                                </>
                            )}
                        </div>
                        <p className="txt-xs faint" style={{ marginTop: 16 }}>
                            {isAuth
                                ? <>Signed in as <span style={{ color: "var(--fg)" }}>{user?.email}</span>.</>
                                : <>No credit card. Email verification only.</>}
                        </p>
                    </div>

                    {/* Code preview */}
                    <div className="code-card">
                        <div className="code-card__bar">
                            <span className="dot dot--r" />
                            <span className="dot dot--y" />
                            <span className="dot dot--g" />
                            <span className="label">POST /api/v1/login</span>
                        </div>
                        <pre>{`curl -X POST http://localhost:5000/api/v1/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"alice@example.com","password":"Strong#123"}'

← 200 OK
{
  "success": true,
  "message": "OTP sent to alice@example.com.
              The code expires in 5 minutes."
}`}</pre>
                        <div className="code-card__foot">
                            Then <code>POST /api/v1/verify</code> with the OTP to receive
                            {" "}<code>accessToken</code>, <code>refreshToken</code>, <code>csrfToken</code> cookies.
                        </div>
                    </div>
                </div>
            </section>

            {/* TECH STRIP */}
            <section className="tech-strip">
                <div className="tech-strip__inner">
                    <p className="tech-label">Built with the modern MERN stack</p>
                    <div className="tech-row">
                        {["React 19","Vite 7","Express 5","MongoDB","Redis","JWT","Zod 4","Helmet","Nodemailer"].map(n =>
                            <span key={n} className="tech-badge">{n}</span>
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="container section">
                <div className="text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
                    <p className="eyebrow">Features</p>
                    <h2 className="h-1" style={{ marginTop: 8 }}>Everything you need to ship auth</h2>
                    <p className="muted" style={{ marginTop: 12 }}>
                        Six layers of defense, six clean APIs, no surprises. Pick what you need; the rest stays out of your way.
                    </p>
                </div>

                <div className="grid grid-3" style={{ marginTop: 40 }}>
                    <Feature icon={<MailIcon />} title="Email verification"
                        body="Sign-up data lives in Redis for 5 minutes. The user only lands in MongoDB after they click the verify link." />
                    <Feature icon={<KeyIcon />} title="JWT + Redis sessions"
                        body="15-minute access cookies, 7-day refresh, single active session per user. Logout revokes everything." />
                    <Feature icon={<ShieldIcon />} title="OTP-based 2FA"
                        body="A 6-digit code on every login, 5 attempts before a 15-minute lockout, and a 60-second resend cooldown." />
                    <Feature icon={<LockIcon />} title="CSRF protection"
                        body="Double-submit cookie + custom header. The axios interceptor refreshes silently on expiry." />
                    <Feature icon={<BoltIcon />} title="Rate limiting"
                        body="Global limiter + stricter per-route limiter on /login, /register, /forgot-password. Per-IP, per-email cooldowns." />
                    <Feature icon={<RefreshIcon />} title="Password reset"
                        body="Time-boxed Redis token, signs the user out of every device on success. Email enumeration safe." />
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ borderTop: "1px solid var(--line)", background: "color-mix(in srgb, var(--bg-elev) 50%, transparent)" }}>
                <div className="container section">
                    <div className="text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
                        <p className="eyebrow">How it works</p>
                        <h2 className="h-1" style={{ marginTop: 8 }}>Three steps from sign-up to session</h2>
                    </div>
                    <ol className="grid grid-3" style={{ marginTop: 40 }}>
                        {[
                            { n: "01", t: "Register", d: "Pending sign-up cached in Redis. Verify link mailed (5-min TTL)." },
                            { n: "02", t: "Verify email", d: "Click the link → user persisted in MongoDB → ready to sign in." },
                            { n: "03", t: "Login + OTP", d: "Password → 6-digit OTP → httpOnly cookies + CSRF token." }
                        ].map((s) => (
                            <li key={s.n} className="step-card">
                                <p className="step-card__num">{s.n}</p>
                                <h3>{s.t}</h3>
                                <p>{s.d}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* SECURITY */}
            <section className="container section">
                <div className="grid grid-2">
                    <div>
                        <p className="eyebrow">Security</p>
                        <h2 className="h-1" style={{ marginTop: 8 }}>Hardened by default, not as an afterthought</h2>
                        <p className="muted" style={{ marginTop: 12 }}>
                            Every defense below is wired in from boot. Helmet sets HSTS and the usual headers; cookies are
                            <code style={{ margin: "0 4px", padding: "1px 6px", borderRadius: 4, background: "var(--bg-muted)", color: "var(--fg)" }}>httpOnly</code>
                            so XSS payloads can&apos;t exfiltrate them; tokens are stored in Redis so revocation is real.
                        </p>
                    </div>
                    <ul className="stack">
                        {[
                            "MongoDB operator injection blocked via mongo-sanitize",
                            "Strong-password Zod schema (8+, upper/lower/number/symbol)",
                            "OTP attempt limit + 15-min lockout per email",
                            "HTTP-only access + refresh cookies, never in localStorage",
                            "Email enumeration safe responses on forgot/resend endpoints",
                            "Helmet, compression, request-id correlation, graceful shutdown",
                            "Fail-fast bootstrap with a typed env validator",
                            "Single-active-session: logging in elsewhere kills the previous one"
                        ].map((line) => (
                            <li key={line} className="checklist-item">
                                <span className="checklist-item__icon"><CheckIcon /></span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* STATS */}
            <section style={{ borderTop: "1px solid var(--line)", background: "color-mix(in srgb, var(--bg-elev) 50%, transparent)" }}>
                <div className="container section--sm">
                    <div className="grid grid-4">
                        <Stat value="20+" label="critical bugs fixed" />
                        <Stat value="6" label="theme palettes" />
                        <Stat value="14" label="API endpoints" />
                        <Stat value="0" label="vulnerabilities" />
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="container section text-center" style={{ maxWidth: 720 }}>
                <h2 className="h-1">Ready to take it for a spin?</h2>
                <p className="muted" style={{ marginTop: 12 }}>
                    Create an account in under a minute. Or sign in if you&apos;ve been here before.
                </p>
                <div className="cta-row" style={{ justifyContent: "center", marginTop: 32 }}>
                    {isAuth ? (
                        <Link to="/home"><Button size="lg">Go to your dashboard</Button></Link>
                    ) : (
                        <>
                            <Link to="/register"><Button size="lg">Create your account</Button></Link>
                            <Link to="/login"><Button size="lg" variant="ghost">I already have one</Button></Link>
                        </>
                    )}
                </div>
                <p className="txt-xs faint" style={{ marginTop: 16 }}>
                    Tip: use the <span style={{ color: "var(--fg)" }}>Themes</span> button in the top-right to switch between six different palettes.
                </p>
            </section>
        </>
    );
};

export default Landing;

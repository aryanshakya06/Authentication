import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Button } from "../components/ui/Button.jsx";
import { APP_NAME } from "../config/env.js";

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Feature = ({ icon, title, body }) => (
    <div className="rounded-xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:border-line-strong">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-soft text-brand">
            {icon}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-fg">{title}</h3>
        <p className="mt-1 text-sm text-fg-muted">{body}</p>
    </div>
);

const Stat = ({ value, label }) => (
    <div className="rounded-xl border border-line bg-card px-5 py-4 text-center">
        <p className="text-3xl font-bold text-fg">{value}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-fg-faint">{label}</p>
    </div>
);

const TechBadge = ({ children }) => (
    <span className="rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-fg-muted">
        {children}
    </span>
);

const Landing = () => {
    const { isAuth, user } = useAuth();

    return (
        <div className="bg-page">
            {/* HERO */}
            <section className="relative overflow-hidden">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{ background: "var(--hero-grad)", filter: "blur(80px)", transform: "translateY(-30%)" }}
                />
                <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-fg-muted">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                MERN authentication, batteries included
                            </span>
                            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-fg sm:text-5xl lg:text-6xl">
                                Authentication that&apos;s{" "}
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{ backgroundImage: "var(--hero-grad)" }}
                                >
                                    secure by default
                                </span>
                            </h1>
                            <p className="mt-5 max-w-xl text-lg text-fg-muted">
                                Email verification, JWT access &amp; refresh rotation, Redis-backed single-active-session
                                enforcement, double-submit CSRF, OTP-based 2FA on every login, and password reset &mdash;
                                all in one tightly-tested stack you can read, audit, and ship.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {isAuth ? (
                                    <Link to="/home">
                                        <Button size="lg">Open your dashboard &rarr;</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/register">
                                            <Button size="lg">Get started &mdash; it&apos;s free</Button>
                                        </Link>
                                        <Link to="/login">
                                            <Button size="lg" variant="outline">Sign in</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                            <p className="mt-4 text-xs text-fg-faint">
                                {isAuth
                                    ? <>Signed in as <span className="text-fg">{user?.email}</span>.</>
                                    : <>No credit card. Email verification only.</>}
                            </p>
                        </div>

                        {/* CODE PREVIEW CARD */}
                        <div className="relative">
                            <div className="rounded-2xl border border-line bg-card shadow-xl">
                                <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                                    <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                                    <span className="ml-2 text-xs text-fg-faint font-mono">POST /api/v1/login</span>
                                </div>
                                <pre
                                    className="overflow-x-auto p-4 text-[12px] leading-relaxed"
                                    style={{ background: "var(--bg-input)", color: "var(--fg)", fontFamily: "Consolas, Menlo, monospace" }}
                                >
{`curl -X POST http://localhost:5000/api/v1/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"alice@example.com","password":"Strong#123"}'

← 200 OK
{
  "success": true,
  "message": "OTP sent to alice@example.com.
              The code expires in 5 minutes."
}`}
                                </pre>
                                <div className="border-t border-line px-4 py-3 text-xs text-fg-faint">
                                    Then <code className="rounded bg-bg-muted px-1.5 py-0.5 text-fg">POST /api/v1/verify</code> with the OTP to receive
                                    {" "}<code className="rounded bg-bg-muted px-1.5 py-0.5 text-fg">accessToken</code>,
                                    {" "}<code className="rounded bg-bg-muted px-1.5 py-0.5 text-fg">refreshToken</code>,
                                    {" "}<code className="rounded bg-bg-muted px-1.5 py-0.5 text-fg">csrfToken</code> cookies.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TECH STACK */}
            <section className="border-y border-line bg-card/50">
                <div className="mx-auto max-w-6xl px-6 py-6">
                    <p className="text-center text-xs uppercase tracking-wider text-fg-faint">
                        Built with the modern MERN stack
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        <TechBadge>React 19</TechBadge>
                        <TechBadge>Vite 7</TechBadge>
                        <TechBadge>Tailwind CSS 4</TechBadge>
                        <TechBadge>Express 5</TechBadge>
                        <TechBadge>MongoDB</TechBadge>
                        <TechBadge>Redis</TechBadge>
                        <TechBadge>JWT</TechBadge>
                        <TechBadge>Zod 4</TechBadge>
                        <TechBadge>Helmet</TechBadge>
                        <TechBadge>Nodemailer</TechBadge>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mx-auto max-w-6xl px-6 py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand">Features</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                        Everything you need to ship auth
                    </h2>
                    <p className="mt-3 text-fg-muted">
                        Six layers of defense, six clean APIs, no surprises. Pick what you need; the rest stays out of your way.
                    </p>
                </div>
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Feature
                        icon={<MailIcon />}
                        title="Email verification"
                        body="Sign-up data lives in Redis for 5 minutes. The user only lands in MongoDB after they click the verify link."
                    />
                    <Feature
                        icon={<KeyIcon />}
                        title="JWT + Redis sessions"
                        body="15-minute access cookies, 7-day refresh, single active session per user. Logout revokes everything."
                    />
                    <Feature
                        icon={<ShieldIcon />}
                        title="OTP-based 2FA"
                        body="A 6-digit code on every login, 5 attempts before a 15-minute lockout, and a 60-second resend cooldown."
                    />
                    <Feature
                        icon={<LockIcon />}
                        title="CSRF protection"
                        body="Double-submit cookie + custom header. The axios interceptor refreshes silently on expiry."
                    />
                    <Feature
                        icon={<BoltIcon />}
                        title="Rate limiting"
                        body="Global limiter + stricter per-route limiter on /login, /register, /forgot-password. Per-IP, per-email cooldowns."
                    />
                    <Feature
                        icon={<RefreshIcon />}
                        title="Password reset"
                        body="Time-boxed Redis token, signs the user out of every device on success. Email enumeration safe."
                    />
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-t border-line bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-brand">How it works</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                            Three steps from sign-up to session
                        </h2>
                    </div>
                    <ol className="mt-12 grid gap-6 md:grid-cols-3">
                        {[
                            { n: "01", t: "Register", d: "Pending sign-up cached in Redis. Verify link mailed (5-min TTL)." },
                            { n: "02", t: "Verify email", d: "Click the link &rarr; user persisted in MongoDB &rarr; ready to sign in." },
                            { n: "03", t: "Login + OTP", d: "Password &rarr; 6-digit OTP &rarr; httpOnly cookies + CSRF token." }
                        ].map((s) => (
                            <li key={s.n} className="rounded-xl border border-line bg-card p-6">
                                <p className="font-mono text-sm text-fg-faint">{s.n}</p>
                                <h3 className="mt-2 text-lg font-semibold text-fg">{s.t}</h3>
                                <p className="mt-1 text-sm text-fg-muted" dangerouslySetInnerHTML={{ __html: s.d }} />
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* SECURITY HIGHLIGHTS */}
            <section className="mx-auto max-w-6xl px-6 py-20">
                <div className="grid items-start gap-12 lg:grid-cols-2">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-brand">Security</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                            Hardened by default, not as an afterthought
                        </h2>
                        <p className="mt-3 text-fg-muted">
                            Every defense below is wired in from boot. Helmet sets HSTS and the usual headers; cookies are
                            <code className="mx-1 rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs text-fg">httpOnly</code>
                            so XSS payloads can&apos;t exfiltrate them; tokens are stored in Redis so revocation is real.
                        </p>
                    </div>
                    <ul className="space-y-3">
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
                            <li key={line} className="flex gap-3 rounded-lg border border-line bg-card p-3 text-sm text-fg-muted">
                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-brand">
                                    <CheckIcon />
                                </span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* STATS */}
            <section className="border-t border-line bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-14">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Stat value="20+" label="critical bugs fixed" />
                        <Stat value="6" label="theme palettes" />
                        <Stat value="14" label="API endpoints" />
                        <Stat value="100%" label="lint + build clean" />
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="mx-auto max-w-4xl px-6 py-20 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                    Ready to take it for a spin?
                </h2>
                <p className="mt-3 text-fg-muted">
                    Create an account in under a minute. Or sign in if you&apos;ve been here before.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {isAuth ? (
                        <Link to="/home">
                            <Button size="lg">Go to your dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button size="lg">Create your account</Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="ghost">I already have one</Button>
                            </Link>
                        </>
                    )}
                </div>
                <p className="mt-4 text-xs text-fg-faint">
                    Tip: use the <span className="text-fg">Themes</span> button in the top-right to switch between
                    {" "}six different palettes.
                </p>
            </section>
        </div>
    );
};

export default Landing;

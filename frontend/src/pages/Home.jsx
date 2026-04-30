import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth.js";
import { Button } from "../components/ui/Button.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleString(undefined, {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    } catch {
        return iso;
    }
};

const formatDelta = (iso) => {
    if (!iso) return "—";
    const ms = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
};

const StatCard = ({ label, value, hint, accent }) => (
    <div className="rounded-xl border border-line bg-card p-5">
        <p className="text-xs uppercase tracking-wide text-fg-faint">{label}</p>
        <p className={`mt-1.5 text-2xl font-semibold ${accent ? "text-brand" : "text-fg"}`}>{value}</p>
        {hint ? <p className="mt-1 text-xs text-fg-faint">{hint}</p> : null}
    </div>
);

const InfoRow = ({ k, v, mono }) => (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-0">
        <span className="text-sm text-fg-faint">{k}</span>
        <span className={`text-right text-sm text-fg break-all ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
);

const CheckRow = ({ ok, text, sub }) => (
    <li className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            ok ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
        }`}>
            {ok ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            )}
        </span>
        <span>
            <p className="text-sm font-medium text-fg">{text}</p>
            {sub ? <p className="text-xs text-fg-faint">{sub}</p> : null}
        </span>
    </li>
);

const QuickAction = ({ icon, title, desc, onClick, to, danger }) => {
    const inner = (
        <div className={`group flex items-start gap-3 rounded-lg border border-line bg-card p-4 transition hover:-translate-y-0.5 ${danger ? "hover:border-danger" : "hover:border-line-strong"}`}>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${danger ? "bg-danger/10 text-danger" : "bg-brand-soft text-brand"}`}>
                {icon}
            </span>
            <div>
                <p className="text-sm font-semibold text-fg">{title}</p>
                <p className="text-xs text-fg-faint">{desc}</p>
            </div>
        </div>
    );
    if (to) return <Link to={to}>{inner}</Link>;
    return <button type="button" onClick={onClick} className="w-full text-left">{inner}</button>;
};

const Home = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [csrfBusy, setCsrfBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get("/api/v1/me");
                if (!cancelled) setProfile(data);
            } catch (err) {
                if (!cancelled) showError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const refreshCsrf = async () => {
        setCsrfBusy(true);
        try {
            const { data } = await api.post("/api/v1/refresh-csrf");
            toast.success(data.message || "CSRF token refreshed");
        } catch (err) {
            showError(err);
        } finally {
            setCsrfBusy(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size="lg" label="Loading your dashboard..." />
            </div>
        );
    }

    const sessionInfo = profile?.sessionInfo || {};
    const memberSince = user?.createdAt;
    const accountAgeDays = memberSince
        ? Math.max(0, Math.floor((Date.now() - new Date(memberSince).getTime()) / 86400000))
        : 0;

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            {/* WELCOME */}
            <div
                className="overflow-hidden rounded-2xl border border-line p-6 sm:p-8"
                style={{ background: "var(--hero-grad)" }}
            >
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-on-brand">
                        <p className="text-xs uppercase tracking-wider opacity-80">Welcome back</p>
                        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                            Hello, {user?.name?.split(" ")[0] || "friend"} 👋
                        </h1>
                        <p className="mt-2 max-w-2xl opacity-90">
                            Your session is active and protected by httpOnly cookies, CSRF tokens, and
                            a Redis-backed refresh chain. Single-active-session means you&apos;re the only
                            one signed in.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {user?.role === "admin" ? (
                            <Link to="/dashboard">
                                <Button variant="outline" size="md" className="border-white/40! text-on-brand! hover:bg-white/10!">
                                    Open admin
                                </Button>
                            </Link>
                        ) : null}
                        <Button
                            size="md"
                            variant="outline"
                            onClick={() => logoutUser(navigate)}
                            className="border-white/40! text-on-brand! hover:bg-white/10!"
                        >
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Account role" value={user?.role || "user"} hint={user?.role === "admin" ? "Full administrative access" : "Standard user access"} />
                <StatCard label="Account age" value={`${accountAgeDays} day${accountAgeDays === 1 ? "" : "s"}`} hint={memberSince ? `Joined ${formatDate(memberSince)}` : ""} />
                <StatCard label="Active session" value="1 device" hint="Single-active-session enforced" accent />
                <StatCard label="Last activity" value={formatDelta(sessionInfo.lastActivity)} hint={sessionInfo.lastActivity ? formatDate(sessionInfo.lastActivity) : "—"} />
            </div>

            {/* MAIN GRID */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {/* LEFT COL: account + session */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-2xl border border-line bg-card p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-fg">Account information</h2>
                            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Verified</span>
                        </div>
                        <div className="mt-4">
                            <InfoRow k="Full name" v={user?.name || "—"} />
                            <InfoRow k="Email" v={user?.email || "—"} />
                            <InfoRow k="Role" v={user?.role || "user"} />
                            <InfoRow k="User ID" v={user?._id || "—"} mono />
                            <InfoRow k="Member since" v={formatDate(memberSince)} />
                            <InfoRow k="Last updated" v={formatDate(user?.updatedAt)} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-line bg-card p-6">
                        <h2 className="text-lg font-semibold text-fg">Current session</h2>
                        <p className="text-sm text-fg-faint">Server-side metadata for your active Redis-backed session.</p>
                        <div className="mt-4">
                            <InfoRow k="Session ID" v={sessionInfo.sessionId || "—"} mono />
                            <InfoRow k="Logged in" v={formatDate(sessionInfo.loginTime)} />
                            <InfoRow k="Last activity" v={formatDate(sessionInfo.lastActivity)} />
                            <InfoRow k="Access TTL" v="15 minutes (auto-refreshed)" />
                            <InfoRow k="Refresh TTL" v="7 days (single-active-session)" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-line bg-card p-6">
                        <h2 className="text-lg font-semibold text-fg">Recent activity</h2>
                        <p className="text-sm text-fg-faint">Auth events from your account. (Demo timeline — real audit log is on the roadmap.)</p>
                        <ol className="mt-4 space-y-3">
                            {[
                                { t: formatDelta(sessionInfo.lastActivity), label: "Profile loaded", desc: "GET /api/v1/me" },
                                { t: formatDelta(sessionInfo.loginTime), label: "Signed in via OTP", desc: "POST /api/v1/verify" },
                                { t: formatDelta(sessionInfo.loginTime), label: "Login requested", desc: "POST /api/v1/login" }
                            ].map((row, i) => (
                                <li key={i} className="flex items-start gap-3 border-b border-line pb-3 last:border-0">
                                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-fg">{row.label}</p>
                                        <p className="text-xs text-fg-faint font-mono">{row.desc}</p>
                                    </div>
                                    <span className="text-xs text-fg-faint">{row.t}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* RIGHT COL: security + actions */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-line bg-card p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-fg">Security checklist</h2>
                            <span className="text-xs font-medium text-success">3 / 3</span>
                        </div>
                        <ul className="mt-4 space-y-3">
                            <CheckRow ok text="Email verified" sub="Required to create the account" />
                            <CheckRow ok text="Strong password" sub="8+ chars, mixed case, number, symbol" />
                            <CheckRow ok text="2FA on every login" sub="6-digit OTP, 5-min window" />
                            <CheckRow ok text="HTTP-only auth cookies" sub="No tokens in localStorage" />
                            <CheckRow ok text="CSRF protected mutations" sub="Double-submit cookie + header" />
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-line bg-card p-6">
                        <h2 className="text-lg font-semibold text-fg">Quick actions</h2>
                        <div className="mt-4 space-y-3">
                            <QuickAction
                                to="/forgot-password"
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>}
                                title="Change password"
                                desc="Send a reset link to your email"
                            />
                            <QuickAction
                                onClick={refreshCsrf}
                                icon={csrfBusy ? <Spinner size="sm" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" /></svg>}
                                title="Rotate CSRF token"
                                desc="Invalidate the current token"
                            />
                            <QuickAction
                                onClick={() => logoutUser(navigate)}
                                danger
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}
                                title="Sign out everywhere"
                                desc="Revoke session and clear cookies"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-line bg-card p-6">
                        <h2 className="text-lg font-semibold text-fg">API explorer</h2>
                        <p className="text-sm text-fg-faint">A few endpoints you can call right now.</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            {[
                                ["GET", "/api/v1/me"],
                                ["POST", "/api/v1/refresh"],
                                ["POST", "/api/v1/refresh-csrf"],
                                ["GET", "/api/v1/health"]
                            ].map(([m, p]) => (
                                <li key={p} className="flex items-center gap-3 rounded-md border border-line bg-bg-muted px-3 py-2 font-mono text-xs">
                                    <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold text-brand">{m}</span>
                                    <span className="text-fg">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

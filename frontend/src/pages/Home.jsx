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
    return `${Math.floor(hr / 24)}d ago`;
};

const Tile = ({ label, value, hint, accent }) => (
    <div className="tile">
        <p className="tile__label">{label}</p>
        <p className={accent ? "tile__value tile__value--brand" : "tile__value"}>{value}</p>
        {hint ? <p className="tile__hint">{hint}</p> : null}
    </div>
);

const InfoRow = ({ k, v, mono }) => (
    <div className="info-row">
        <span className="info-row__k">{k}</span>
        <span className={mono ? "info-row__v mono" : "info-row__v"}>{v}</span>
    </div>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CheckRow = ({ text, sub }) => (
    <li className="check-row">
        <span className="check-row__icon"><CheckIcon /></span>
        <span>
            <p className="check-row__title">{text}</p>
            {sub ? <p className="check-row__sub">{sub}</p> : null}
        </span>
    </li>
);

const Action = ({ icon, title, desc, onClick, to, danger }) => {
    const inner = (
        <div className={`action-row ${danger ? "is-danger" : ""}`}>
            <span className="action-row__icon">{icon}</span>
            <div>
                <p className="action-row__title">{title}</p>
                <p className="action-row__desc">{desc}</p>
            </div>
        </div>
    );
    if (to) return <Link to={to} style={{ textDecoration: "none" }}>{inner}</Link>;
    return <button type="button" onClick={onClick} className="action-row__btn" style={{ background: "transparent", border: 0, padding: 0, width: "100%", textAlign: "left", cursor: "pointer" }}>{inner}</button>;
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
            <div className="center-screen">
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
        <div className="container" style={{ padding: "40px 24px" }}>
            {/* WELCOME */}
            <div className="welcome">
                <div className="welcome__row">
                    <div>
                        <p className="welcome__small">Welcome back</p>
                        <h1 className="welcome__title">Hello, {user?.name?.split(" ")[0] || "friend"} 👋</h1>
                        <p className="welcome__sub">
                            Your session is active and protected by httpOnly cookies, CSRF tokens, and
                            a Redis-backed refresh chain. Single-active-session means you&apos;re the only
                            one signed in.
                        </p>
                    </div>
                    <div className="welcome__actions">
                        {user?.role === "admin" ? (
                            <Link to="/dashboard"><Button variant="invert" size="md">Open admin</Button></Link>
                        ) : null}
                        <Button variant="invert" size="md" onClick={() => logoutUser(navigate)}>Sign out</Button>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-4" style={{ marginTop: 24 }}>
                <Tile label="Account role" value={user?.role || "user"}
                      hint={user?.role === "admin" ? "Full administrative access" : "Standard user access"} />
                <Tile label="Account age" value={`${accountAgeDays} day${accountAgeDays === 1 ? "" : "s"}`}
                      hint={memberSince ? `Joined ${formatDate(memberSince)}` : ""} />
                <Tile label="Active session" value="1 device" hint="Single-active-session enforced" accent />
                <Tile label="Last activity" value={formatDelta(sessionInfo.lastActivity)}
                      hint={sessionInfo.lastActivity ? formatDate(sessionInfo.lastActivity) : "—"} />
            </div>

            {/* MAIN GRID */}
            <div className="grid" style={{ marginTop: 32, gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                <div className="stack stack--xl">
                    <div className="card card--lg">
                        <div className="row row--spread">
                            <h2 className="h-2">Account information</h2>
                            <span className="pill">Verified</span>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <InfoRow k="Full name" v={user?.name || "—"} />
                            <InfoRow k="Email" v={user?.email || "—"} />
                            <InfoRow k="Role" v={user?.role || "user"} />
                            <InfoRow k="User ID" v={user?._id || "—"} mono />
                            <InfoRow k="Member since" v={formatDate(memberSince)} />
                            <InfoRow k="Last updated" v={formatDate(user?.updatedAt)} />
                        </div>
                    </div>

                    <div className="card card--lg">
                        <h2 className="h-2">Current session</h2>
                        <p className="faint txt-md" style={{ marginTop: 4 }}>
                            Server-side metadata for your active Redis-backed session.
                        </p>
                        <div style={{ marginTop: 16 }}>
                            <InfoRow k="Session ID" v={sessionInfo.sessionId || "—"} mono />
                            <InfoRow k="Logged in" v={formatDate(sessionInfo.loginTime)} />
                            <InfoRow k="Last activity" v={formatDate(sessionInfo.lastActivity)} />
                            <InfoRow k="Access TTL" v="15 minutes (auto-refreshed)" />
                            <InfoRow k="Refresh TTL" v="7 days (single-active-session)" />
                        </div>
                    </div>

                    <div className="card card--lg">
                        <h2 className="h-2">Recent activity</h2>
                        <p className="faint txt-md" style={{ marginTop: 4 }}>
                            Auth events from your account. (Demo timeline — real audit log is on the roadmap.)
                        </p>
                        <ol style={{ marginTop: 16 }}>
                            {[
                                { t: formatDelta(sessionInfo.lastActivity), label: "Profile loaded", desc: "GET /api/v1/me" },
                                { t: formatDelta(sessionInfo.loginTime), label: "Signed in via OTP", desc: "POST /api/v1/verify" },
                                { t: formatDelta(sessionInfo.loginTime), label: "Login requested", desc: "POST /api/v1/login" }
                            ].map((row, i) => (
                                <li key={i} className="timeline-item">
                                    <span className="timeline-item__dot" />
                                    <div style={{ flex: 1 }}>
                                        <p className="timeline-item__title">{row.label}</p>
                                        <p className="timeline-item__desc">{row.desc}</p>
                                    </div>
                                    <span className="timeline-item__time">{row.t}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="stack stack--xl">
                    <div className="card card--lg">
                        <div className="row row--spread">
                            <h2 className="h-2">Security checklist</h2>
                            <span className="txt-xs success weight-medium">5 / 5</span>
                        </div>
                        <ul className="stack" style={{ marginTop: 16, gap: 10 }}>
                            <CheckRow text="Email verified" sub="Required to create the account" />
                            <CheckRow text="Strong password" sub="8+ chars, mixed case, number, symbol" />
                            <CheckRow text="2FA on every login" sub="6-digit OTP, 5-min window" />
                            <CheckRow text="HTTP-only auth cookies" sub="No tokens in localStorage" />
                            <CheckRow text="CSRF protected mutations" sub="Double-submit cookie + header" />
                        </ul>
                    </div>

                    <div className="card card--lg">
                        <h2 className="h-2">Quick actions</h2>
                        <div className="stack" style={{ marginTop: 16 }}>
                            <Action
                                to="/forgot-password"
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>}
                                title="Change password"
                                desc="Send a reset link to your email"
                            />
                            <Action
                                onClick={refreshCsrf}
                                icon={csrfBusy ? <Spinner size="sm" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" /></svg>}
                                title="Rotate CSRF token"
                                desc="Invalidate the current token"
                            />
                            <Action
                                onClick={() => logoutUser(navigate)}
                                danger
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}
                                title="Sign out everywhere"
                                desc="Revoke session and clear cookies"
                            />
                        </div>
                    </div>

                    <div className="card card--lg">
                        <h2 className="h-2">API explorer</h2>
                        <p className="faint txt-md" style={{ marginTop: 4 }}>
                            A few endpoints you can call right now.
                        </p>
                        <ul className="stack" style={{ marginTop: 16, gap: 8 }}>
                            {[
                                ["GET", "/api/v1/me"],
                                ["POST", "/api/v1/refresh"],
                                ["POST", "/api/v1/refresh-csrf"],
                                ["GET", "/api/v1/health"]
                            ].map(([m, p]) => (
                                <li key={p} className="endpoint">
                                    <span className="endpoint__method">{m}</span>
                                    <span className="endpoint__path">{p}</span>
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

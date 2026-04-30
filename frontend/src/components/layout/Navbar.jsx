import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { APP_NAME } from "../../config/env.js";
import { Button } from "../ui/Button.jsx";
import { ThemePicker } from "../ThemePicker.jsx";

const PaletteIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.7 0 1-.4 1-.9 0-.3-.1-.5-.3-.7-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0 .2.2.5.3.8.3 4.5 0 8.1-3.6 8.1-8.1C23 6.4 18 2 12 2z" />
    </svg>
);

export const Navbar = () => {
    const { isAuth, user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [pickerOpen, setPickerOpen] = useState(false);

    return (
        <>
            <header className="navbar">
                <nav className="navbar__inner">
                    <Link to="/" className="brand">
                        <span className="brand__mark">A</span>
                        <span>{APP_NAME}</span>
                    </Link>

                    <div className="navbar__actions">
                        <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className="btn btn--ghost btn--sm"
                            aria-label="Choose theme"
                        >
                            <PaletteIcon />
                            <span className="hide-sm">Themes</span>
                        </button>

                        {isAuth ? (
                            <>
                                <Link to="/home" className="hide-sm">Home</Link>
                                {user?.role === "admin" ? (
                                    <Link to="/dashboard" style={{ color: "var(--brand)" }}>Admin</Link>
                                ) : null}
                                <span className="navbar__email hide-sm">{user?.email}</span>
                                <Button variant="ghost" size="sm" onClick={() => logoutUser(navigate)}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Sign in</Link>
                                <Link to="/register">
                                    <Button size="sm">Get started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>
            <ThemePicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
        </>
    );
};

export default Navbar;

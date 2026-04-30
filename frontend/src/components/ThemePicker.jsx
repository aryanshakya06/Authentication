import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const Swatch = ({ swatch }) => (
    <div className="theme-card__swatch">
        <span style={{ background: swatch.bg }} />
        <span style={{ background: swatch.card }} />
        <span style={{ background: swatch.brand }} />
        <span style={{ background: swatch.text }} />
    </div>
);

const ThemeCard = ({ theme, active, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect(theme.id)}
        aria-pressed={active}
        className={`theme-card ${active ? "is-active" : ""}`}
    >
        <Swatch swatch={theme.swatch} />
        <div className="theme-card__head">
            <div>
                <p className="theme-card__label">{theme.label}</p>
                <p className="theme-card__desc">{theme.description}</p>
            </div>
            {active ? <span className="theme-card__pill">Active</span> : null}
        </div>
    </button>
);

export const ThemePicker = ({ open, onClose }) => {
    const { themeId, setTheme, themes } = useTheme();

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const dark = themes.filter((t) => t.group === "dark");
    const light = themes.filter((t) => t.group === "light");

    return (
        <div className="modal-root" role="dialog" aria-modal="true" aria-label="Choose a theme">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal">
                <div className="modal__head">
                    <div>
                        <h2 className="modal__title">Choose a theme</h2>
                        <p className="modal__sub">Switching is instant and persists across reloads.</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close" className="btn-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal__body">
                    <div className="theme-section">
                        <p className="theme-section__label">Dark</p>
                        <div className="theme-grid">
                            {dark.map((t) => (
                                <ThemeCard key={t.id} theme={t} active={t.id === themeId} onSelect={setTheme} />
                            ))}
                        </div>
                    </div>

                    <div className="theme-section">
                        <p className="theme-section__label">Light</p>
                        <div className="theme-grid">
                            {light.map((t) => (
                                <ThemeCard key={t.id} theme={t} active={t.id === themeId} onSelect={setTheme} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemePicker;

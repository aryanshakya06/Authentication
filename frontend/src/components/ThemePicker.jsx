import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const Swatch = ({ swatch }) => (
    <div className="flex h-10 w-full overflow-hidden rounded-md border border-line">
        <span className="flex-1" style={{ background: swatch.bg }} />
        <span className="flex-1" style={{ background: swatch.card }} />
        <span className="flex-1" style={{ background: swatch.brand }} />
        <span className="flex-1" style={{ background: swatch.text }} />
    </div>
);

const ThemeCard = ({ theme, active, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect(theme.id)}
        aria-pressed={active}
        className={[
            "group flex flex-col gap-3 rounded-xl border p-3 text-left transition",
            "hover:-translate-y-0.5",
            active
                ? "border-brand ring-2 ring-brand/30 shadow-md"
                : "border-line hover:border-line-strong"
        ].join(" ")}
        style={{ background: "var(--bg-elev)" }}
    >
        <Swatch swatch={theme.swatch} />
        <div className="flex items-start justify-between gap-2">
            <div>
                <p className="text-sm font-semibold text-fg">{theme.label}</p>
                <p className="mt-0.5 text-xs text-fg-faint">{theme.description}</p>
            </div>
            {active ? (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-on-brand">
                    Active
                </span>
            ) : null}
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a theme"
        >
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line shadow-2xl"
                style={{ background: "var(--bg-elev)" }}
            >
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-fg">Choose a theme</h2>
                        <p className="text-xs text-fg-faint">Switching is instant and persists across reloads.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-md p-2 text-fg-faint hover:bg-bg-muted hover:text-fg"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Dark</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {dark.map((t) => (
                            <ThemeCard key={t.id} theme={t} active={t.id === themeId} onSelect={setTheme} />
                        ))}
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-fg-faint">Light</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {light.map((t) => (
                            <ThemeCard key={t.id} theme={t} active={t.id === themeId} onSelect={setTheme} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemePicker;

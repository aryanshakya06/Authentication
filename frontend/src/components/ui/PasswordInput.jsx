import React, { useId, useState } from "react";

export const PasswordInput = ({
    label,
    error,
    helperText,
    id,
    className = "",
    ...rest
}) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [shown, setShown] = useState(false);
    const describedById = helperText || error ? `${inputId}-help` : undefined;

    const borderClass = error
        ? "border-danger focus:border-danger focus:ring-danger/30"
        : "border-line focus:border-brand focus:ring-brand/25";

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-fg-muted">
                    {label}
                </label>
            ) : null}
            <div className="relative">
                <input
                    id={inputId}
                    type={shown ? "text" : "password"}
                    aria-invalid={!!error}
                    aria-describedby={describedById}
                    className={`w-full rounded-md border px-3 py-2 pr-16 text-base text-fg outline-none transition focus:ring-2 ${borderClass}`}
                    style={{ background: "var(--bg-input)" }}
                    {...rest}
                />
                <button
                    type="button"
                    onClick={() => setShown((v) => !v)}
                    aria-label={shown ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-xs font-medium text-fg-faint hover:text-fg"
                >
                    {shown ? "Hide" : "Show"}
                </button>
            </div>
            {error ? (
                <p id={describedById} className="text-xs text-danger">{error}</p>
            ) : helperText ? (
                <p id={describedById} className="text-xs text-fg-faint">{helperText}</p>
            ) : null}
        </div>
    );
};

export default PasswordInput;

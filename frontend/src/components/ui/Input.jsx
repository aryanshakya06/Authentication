import React, { useId } from "react";

export const Input = ({
    label,
    error,
    helperText,
    id,
    className = "",
    ...rest
}) => {
    const generatedId = useId();
    const inputId = id || generatedId;
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
            <input
                id={inputId}
                aria-invalid={!!error}
                aria-describedby={describedById}
                className={`w-full rounded-md border px-3 py-2 text-base text-fg outline-none transition focus:ring-2 ${borderClass}`}
                style={{ background: "var(--bg-input)" }}
                {...rest}
            />
            {error ? (
                <p id={describedById} className="text-xs text-danger">{error}</p>
            ) : helperText ? (
                <p id={describedById} className="text-xs text-fg-faint">{helperText}</p>
            ) : null}
        </div>
    );
};

export default Input;

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
    const describedById = (helperText || error) ? `${inputId}-help` : undefined;

    return (
        <div className={`field ${className}`}>
            {label ? (
                <label htmlFor={inputId} className="field__label">
                    {label}
                </label>
            ) : null}
            <div className="password">
                <input
                    id={inputId}
                    type={shown ? "text" : "password"}
                    className={`input ${error ? "is-error" : ""}`}
                    aria-invalid={!!error}
                    aria-describedby={describedById}
                    {...rest}
                />
                <button
                    type="button"
                    onClick={() => setShown((v) => !v)}
                    aria-label={shown ? "Hide password" : "Show password"}
                    className="password__toggle"
                >
                    {shown ? "Hide" : "Show"}
                </button>
            </div>
            {error ? (
                <p id={describedById} className="field__error">{error}</p>
            ) : helperText ? (
                <p id={describedById} className="field__hint">{helperText}</p>
            ) : null}
        </div>
    );
};

export default PasswordInput;

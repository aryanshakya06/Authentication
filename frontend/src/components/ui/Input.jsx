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
    const describedById = (helperText || error) ? `${inputId}-help` : undefined;

    return (
        <div className={`field ${className}`}>
            {label ? (
                <label htmlFor={inputId} className="field__label">
                    {label}
                </label>
            ) : null}
            <input
                id={inputId}
                className={`input ${error ? "is-error" : ""}`}
                aria-invalid={!!error}
                aria-describedby={describedById}
                {...rest}
            />
            {error ? (
                <p id={describedById} className="field__error">{error}</p>
            ) : helperText ? (
                <p id={describedById} className="field__hint">{helperText}</p>
            ) : null}
        </div>
    );
};

export default Input;

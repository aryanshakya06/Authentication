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
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200";

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label ? (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            ) : null}
            <input
                id={inputId}
                aria-invalid={!!error}
                aria-describedby={describedById}
                className={`w-full bg-white rounded-md border px-3 py-2 text-base text-gray-900 outline-none transition focus:ring-2 ${borderClass}`}
                {...rest}
            />
            {error ? (
                <p id={describedById} className="text-xs text-red-600">{error}</p>
            ) : helperText ? (
                <p id={describedById} className="text-xs text-gray-500">{helperText}</p>
            ) : null}
        </div>
    );
};

export default Input;

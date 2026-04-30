import React from "react";

const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4"
};

export const Spinner = ({ size = "md", className = "", label }) => (
    <div role="status" aria-label={label || "Loading"} className={`inline-flex items-center gap-2 ${className}`}>
        <span
            className={`${sizes[size] || sizes.md} animate-spin rounded-full border-brand-soft border-t-brand`}
            aria-hidden="true"
        />
        {label ? <span className="text-sm text-fg-muted">{label}</span> : null}
    </div>
);

export default Spinner;

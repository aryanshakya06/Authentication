import React from "react";

const SIZES = { sm: "spinner--sm", md: "spinner--md", lg: "spinner--lg" };

export const Spinner = ({ size = "md", className = "", label }) => (
    <span role="status" aria-label={label || "Loading"} className={`spinner-wrap ${className}`}>
        <span className={`spinner ${SIZES[size] || SIZES.md}`} aria-hidden="true" />
        {label ? <span className="spinner__label">{label}</span> : null}
    </span>
);

export default Spinner;

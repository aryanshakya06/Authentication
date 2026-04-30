import React from "react";
import { Spinner } from "./Spinner.jsx";

const VARIANTS = {
    primary: "btn--primary",
    ghost: "btn--ghost",
    outline: "btn--outline",
    danger: "btn--danger",
    invert: "btn--invert"
};

const SIZES = { sm: "btn--sm", md: "", lg: "btn--lg" };

export const Button = ({
    variant = "primary",
    size = "md",
    loading = false,
    type = "button",
    disabled,
    block = false,
    className = "",
    children,
    ...rest
}) => {
    const classes = [
        "btn",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || "",
        block ? "btn--block" : "",
        className
    ].filter(Boolean).join(" ");

    return (
        <button type={type} disabled={disabled || loading} className={classes} {...rest}>
            {loading ? <Spinner size="sm" /> : null}
            <span>{children}</span>
        </button>
    );
};

export default Button;

import React from "react";
import { Spinner } from "./Spinner.jsx";

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
    primary: "bg-brand text-on-brand hover:bg-brand-hover",
    ghost: "bg-transparent text-fg hover:bg-bg-muted border border-line",
    outline: "bg-transparent text-brand hover:bg-brand-soft border border-brand",
    danger: "bg-danger text-white hover:opacity-90"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg"
};

export const Button = ({
    variant = "primary",
    size = "md",
    loading = false,
    type = "button",
    disabled,
    className = "",
    children,
    ...rest
}) => {
    const cls = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;
    return (
        <button type={type} disabled={disabled || loading} className={cls} {...rest}>
            {loading ? <Spinner size="sm" /> : null}
            <span>{children}</span>
        </button>
    );
};

export default Button;

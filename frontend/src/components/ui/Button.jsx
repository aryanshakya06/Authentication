import React from "react";
import { Spinner } from "./Spinner.jsx";

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost: "bg-transparent text-indigo-700 hover:bg-indigo-50 border border-indigo-200",
    danger: "bg-red-600 text-white hover:bg-red-700"
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

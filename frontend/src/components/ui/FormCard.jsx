import React from "react";

export const FormCard = ({ title, subtitle, children, footer, className = "" }) => (
    <div className={`w-full max-w-md rounded-2xl border border-line bg-card p-8 shadow-sm ${className}`}>
        {title ? <h1 className="text-2xl font-semibold text-fg">{title}</h1> : null}
        {subtitle ? <p className="mt-1 text-sm text-fg-faint">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 text-center text-sm text-fg-faint">{footer}</div> : null}
    </div>
);

export default FormCard;

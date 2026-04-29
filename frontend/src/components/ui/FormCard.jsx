import React from "react";

export const FormCard = ({ title, subtitle, children, footer, className = "" }) => (
    <div className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm ${className}`}>
        {title ? <h1 className="text-2xl font-semibold text-gray-900">{title}</h1> : null}
        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 text-center text-sm text-gray-500">{footer}</div> : null}
    </div>
);

export default FormCard;

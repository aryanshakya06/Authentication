import React from "react";

export const FormCard = ({ title, subtitle, children, footer, className = "" }) => (
    <div className={`form-card ${className}`}>
        {title ? <h1 className="form-card__title">{title}</h1> : null}
        {subtitle ? <p className="form-card__subtitle">{subtitle}</p> : null}
        <div className="form-card__body">{children}</div>
        {footer ? <div className="form-card__footer">{footer}</div> : null}
    </div>
);

export default FormCard;

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
    <main className="center-screen">
        <div className="notfound">
            <p className="notfound__code">404</p>
            <h1>Page not found</h1>
            <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
            <Link to="/" className="btn btn--primary">Back home</Link>
        </div>
    </main>
);

export default NotFound;

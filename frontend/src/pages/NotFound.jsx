import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600">404</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Page not found</h1>
            <p className="mt-2 text-gray-600">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
            <Link
                to="/"
                className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
                Back home
            </Link>
        </div>
    </main>
);

export default NotFound;

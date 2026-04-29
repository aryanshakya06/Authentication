import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { APP_NAME } from "../../config/env.js";
import { Button } from "../ui/Button.jsx";

export const Navbar = () => {
    const { isAuth, user, logoutUser } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900">
                    <span className="inline-block h-7 w-7 rounded-md bg-indigo-600 text-center text-white leading-7">A</span>
                    <span>{APP_NAME}</span>
                </Link>
                <div className="flex items-center gap-3 text-sm">
                    {isAuth ? (
                        <>
                            <span className="hidden text-gray-600 sm:inline">{user?.email}</span>
                            {user?.role === "admin" ? (
                                <Link to="/dashboard" className="text-indigo-700 hover:underline">Admin</Link>
                            ) : null}
                            <Button variant="ghost" size="sm" onClick={() => logoutUser(navigate)}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-gray-900">Sign in</Link>
                            <Link to="/register">
                                <Button size="sm">Get started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

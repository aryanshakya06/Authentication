import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { APP_NAME } from "../config/env.js";
import { Button } from "../components/ui/Button.jsx";

const Home = () => {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium text-indigo-600">{APP_NAME}</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Welcome back, {user?.name || "friend"}
        </h1>
        <p className="mt-2 text-gray-600">
          You&apos;re signed in as <span className="font-medium">{user?.email}</span>.
          Sessions are protected with httpOnly cookies, CSRF tokens, and a Redis-backed refresh
          token rotation. Only one active session is allowed at a time.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
            <p className="mt-1 text-lg font-medium text-gray-900">{user?.role || "user"}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">User ID</p>
            <p className="mt-1 truncate font-mono text-sm text-gray-700">{user?._id}</p>
          </div>
        </div>

        {user?.role === "admin" ? (
          <div className="mt-6">
            <Link to="/dashboard">
              <Button>Open admin dashboard</Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Home;

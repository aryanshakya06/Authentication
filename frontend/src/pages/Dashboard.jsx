import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: payload } = await api.get("/api/v1/admin");
        if (!cancelled) setData(payload);
      } catch (err) {
        if (!cancelled) showError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Loading admin data..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-fg-muted">
        Unable to load admin data.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-fg">Dashboard</h1>
          <p className="mt-2 text-fg-muted">{data.message}</p>
        </div>
        <Link to="/home">
          <Button variant="ghost" size="sm">Back to home</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-fg-faint">Total users</p>
          <p className="mt-1 text-3xl font-bold text-fg">{data.data?.totalUsers ?? "-"}</p>
          <p className="mt-1 text-xs text-fg-faint">Live MongoDB count</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-fg-faint">API status</p>
          <p className="mt-1 text-2xl font-semibold text-success">Healthy</p>
          <p className="mt-1 text-xs text-fg-faint">Mongo + Redis connected</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-fg-faint">Your role</p>
          <p className="mt-1 text-2xl font-semibold text-brand">admin</p>
          <p className="mt-1 text-xs text-fg-faint">authorizeAdmin middleware</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

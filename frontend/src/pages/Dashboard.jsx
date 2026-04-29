import React, { useEffect, useState } from "react";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";
import { Spinner } from "../components/ui/Spinner.jsx";

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
      <div className="mx-auto max-w-3xl px-6 py-16 text-gray-600">
        Unable to load admin data.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">Admin dashboard</h1>
      <p className="mt-2 text-gray-600">{data.message}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total users</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{data.data?.totalUsers ?? "-"}</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

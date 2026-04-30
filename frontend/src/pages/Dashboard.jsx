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
            <div className="center-screen">
                <Spinner size="lg" label="Loading admin data..." />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container muted" style={{ padding: "64px 24px" }}>
                Unable to load admin data.
            </div>
        );
    }

    return (
        <section className="container container--narrow" style={{ padding: "48px 24px" }}>
            <div className="row row--top row--spread">
                <div>
                    <p className="eyebrow">Admin</p>
                    <h1 className="h-1" style={{ marginTop: 4 }}>Dashboard</h1>
                    <p className="muted" style={{ marginTop: 8 }}>{data.message}</p>
                </div>
                <Link to="/home"><Button variant="ghost" size="sm">Back to home</Button></Link>
            </div>

            <div className="grid grid-3" style={{ marginTop: 32 }}>
                <div className="tile">
                    <p className="tile__label">Total users</p>
                    <p className="tile__value" style={{ fontSize: 32 }}>{data.data?.totalUsers ?? "-"}</p>
                    <p className="tile__hint">Live MongoDB count</p>
                </div>
                <div className="tile">
                    <p className="tile__label">API status</p>
                    <p className="tile__value success">Healthy</p>
                    <p className="tile__hint">Mongo + Redis connected</p>
                </div>
                <div className="tile">
                    <p className="tile__label">Your role</p>
                    <p className="tile__value tile__value--brand">admin</p>
                    <p className="tile__hint">authorizeAdmin middleware</p>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;

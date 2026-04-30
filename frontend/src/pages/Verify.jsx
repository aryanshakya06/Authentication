import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api.js";
import { Spinner } from "../components/ui/Spinner.jsx";
import { FormCard } from "../components/ui/FormCard.jsx";
import { Button } from "../components/ui/Button.jsx";
import { getErrorMessage } from "../lib/errors.js";

const Verify = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.post(`/api/v1/verify/${params.token}`);
                if (!cancelled) setSuccessMessage(data.message);
            } catch (err) {
                if (!cancelled) setErrorMessage(getErrorMessage(err));
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [params.token]);

    if (loading) {
        return (
            <div className="center-screen">
                <Spinner size="lg" label="Verifying your email..." />
            </div>
        );
    }

    return (
        <section className="center-screen">
            <FormCard
                title={successMessage ? "Email verified" : "Verification failed"}
                subtitle={successMessage || errorMessage || ""}
                footer={<Link to="/login">Back to sign in</Link>}
            >
                <Link to="/login">
                    <Button block>Continue to sign in</Button>
                </Link>
            </FormCard>
        </section>
    );
};

export default Verify;

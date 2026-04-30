import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";
import { FormCard } from "../components/ui/FormCard.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const { data } = await api.post("/api/v1/forgot-password", { email });
            toast.success(data.message);
            setSent(true);
        } catch (err) {
            showError(err);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <section className="center-screen">
            <FormCard
                title="Forgot your password?"
                subtitle="Enter your email and we'll send you a reset link if your account exists."
                footer={<Link to="/login">Back to sign in</Link>}
            >
                {sent ? (
                    <p className="muted txt-md">
                        Check your inbox at <span className="weight-medium" style={{ color: "var(--fg)" }}>{email}</span> for a reset link.
                    </p>
                ) : (
                    <form onSubmit={submit} className="stack stack--lg">
                        <Input
                            type="email" label="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required autoComplete="email"
                        />
                        <Button type="submit" loading={btnLoading} block>Send reset link</Button>
                    </form>
                )}
            </FormCard>
        </section>
    );
};

export default ForgotPassword;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";
import { FormCard } from "../components/ui/FormCard.jsx";
import { Input } from "../components/ui/Input.jsx";
import { PasswordInput } from "../components/ui/PasswordInput.jsx";
import { Button } from "../components/ui/Button.jsx";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const { data } = await api.post("/api/v1/register", { name, email, password });
            toast.success(data.message);
            if (data.success) setSent(true);
        } catch (err) {
            showError(err);
        } finally {
            setBtnLoading(false);
        }
    };

    if (sent) {
        return (
            <section className="center-screen">
                <FormCard
                    title="Check your inbox"
                    subtitle={`We've sent a verification link to ${email}. Open it within 5 minutes to activate your account.`}
                    footer={<Link to="/login">Back to sign in</Link>}
                >
                    <p className="muted txt-md">
                        Didn&apos;t get an email? Check spam, or come back and re-register in a minute.
                    </p>
                </FormCard>
            </section>
        );
    }

    return (
        <section className="center-screen">
            <FormCard
                title="Create your account"
                subtitle="Sign up in seconds. We'll verify your email before activating the account."
                footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
            >
                <form onSubmit={submit} className="stack stack--lg">
                    <Input
                        type="text" label="Full name" value={name}
                        onChange={(e) => setName(e.target.value)}
                        required autoComplete="name"
                    />
                    <Input
                        type="email" label="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required autoComplete="email"
                    />
                    <PasswordInput
                        label="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required autoComplete="new-password"
                        helperText="At least 8 characters with upper, lower, number, and symbol."
                    />
                    <Button type="submit" loading={btnLoading} block>Create account</Button>
                </form>
            </FormCard>
        </section>
    );
};

export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";
import { FormCard } from "../components/ui/FormCard.jsx";
import { Input } from "../components/ui/Input.jsx";
import { PasswordInput } from "../components/ui/PasswordInput.jsx";
import { Button } from "../components/ui/Button.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const { data } = await api.post("/api/v1/login", { email, password });
            toast.success(data.message);
            if (data.success) navigate("/verify-otp", { state: { email } });
        } catch (err) {
            showError(err);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <section className="center-screen">
            <FormCard
                title="Welcome back"
                subtitle="Sign in to your account. We'll email you a one-time code to confirm it's really you."
                footer={<>Don&apos;t have an account? <Link to="/register">Create one</Link></>}
            >
                <form onSubmit={submit} className="stack stack--lg">
                    <Input
                        type="email" label="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required autoComplete="email"
                    />
                    <PasswordInput
                        label="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required autoComplete="current-password"
                    />
                    <div className="row row--end" style={{ marginTop: -8 }}>
                        <Link to="/forgot-password" className="txt-xs faint">Forgot password?</Link>
                    </div>
                    <Button type="submit" loading={btnLoading} block>Continue</Button>
                </form>
            </FormCard>
        </section>
    );
};

export default Login;

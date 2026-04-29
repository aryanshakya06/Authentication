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
            if (data.success) {
                navigate("/verify-otp", { state: { email } });
            }
        } catch (err) {
            showError(err);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-6 py-12">
            <FormCard
                title="Welcome back"
                subtitle="Sign in to your account. We'll email you a one-time code to confirm it's really you."
                footer={
                    <>
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-indigo-700 hover:underline">Create one</Link>
                    </>
                }
            >
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <PasswordInput
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <div className="flex justify-end -mt-2">
                        <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-800">
                            Forgot password?
                        </Link>
                    </div>
                    <Button type="submit" loading={btnLoading} className="w-full">
                        Continue
                    </Button>
                </form>
            </FormCard>
        </section>
    );
};

export default Login;

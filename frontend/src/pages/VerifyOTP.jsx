import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { showError } from "../lib/errors.js";
import { FormCard } from "../components/ui/FormCard.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";

const RESEND_COOLDOWN_S = 60;

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const { setIsAuth, setUser } = useAuth();

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    useEffect(() => {
        if (!email) navigate("/login", { replace: true });
    }, [email, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const { data } = await api.post("/api/v1/verify", { email, otp });
            toast.success(data.message);
            setIsAuth(true);
            setUser(data.user);
            navigate("/");
        } catch (err) {
            showError(err);
        } finally {
            setBtnLoading(false);
        }
    };

    const resend = async () => {
        if (cooldown > 0 || resendLoading) return;
        setResendLoading(true);
        try {
            const { data } = await api.post("/api/v1/resend-otp", { email });
            toast.success(data.message);
            setCooldown(RESEND_COOLDOWN_S);
        } catch (err) {
            showError(err);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-6 py-12">
            <FormCard
                title="Enter your code"
                subtitle={`We sent a 6-digit code to ${email || "your email"}. The code expires in 5 minutes.`}
                footer={<Link to="/login" className="text-indigo-700 hover:underline">Back to sign in</Link>}
            >
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <Input
                        autoFocus
                        label="Verification code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        autoComplete="one-time-code"
                        required
                    />
                    <Button type="submit" loading={btnLoading} className="w-full">
                        Verify and continue
                    </Button>
                    <button
                        type="button"
                        onClick={resend}
                        disabled={cooldown > 0 || resendLoading}
                        className="text-xs text-gray-500 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                        {cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : resendLoading
                                ? "Sending..."
                                : "Didn't get the code? Resend"}
                    </button>
                </form>
            </FormCard>
        </section>
    );
};

export default VerifyOTP;

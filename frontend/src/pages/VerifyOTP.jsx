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
            navigate("/home");
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
        <section className="center-screen">
            <FormCard
                title="Enter your code"
                subtitle={`We sent a 6-digit code to ${email || "your email"}. The code expires in 5 minutes.`}
                footer={<Link to="/login">Back to sign in</Link>}
            >
                <form onSubmit={submit} className="stack stack--lg">
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
                    <Button type="submit" loading={btnLoading} block>Verify and continue</Button>
                    <button
                        type="button"
                        onClick={resend}
                        disabled={cooldown > 0 || resendLoading}
                        className="txt-xs faint"
                        style={{ opacity: (cooldown > 0 || resendLoading) ? 0.5 : 1 }}
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

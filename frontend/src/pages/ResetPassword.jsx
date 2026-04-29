import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api.js";
import { showError } from "../lib/errors.js";
import { FormCard } from "../components/ui/FormCard.jsx";
import { PasswordInput } from "../components/ui/PasswordInput.jsx";
import { Button } from "../components/ui/Button.jsx";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        setBtnLoading(true);
        try {
            const { data } = await api.post(`/api/v1/reset-password/${encodeURIComponent(token)}`, { password });
            toast.success(data.message);
            navigate("/login");
        } catch (err) {
            showError(err);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-6 py-12">
            <FormCard
                title="Choose a new password"
                subtitle="Pick something strong - at least 8 characters with a mix of upper, lower, number, and symbol."
                footer={<Link to="/login" className="text-indigo-700 hover:underline">Back to sign in</Link>}
            >
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <PasswordInput
                        label="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <PasswordInput
                        label="Confirm new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        autoComplete="new-password"
                        error={error}
                    />
                    <Button type="submit" loading={btnLoading} className="w-full">
                        Reset password
                    </Button>
                </form>
            </FormCard>
        </section>
    );
};

export default ResetPassword;

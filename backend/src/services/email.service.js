import sendMail from "../config/mailer.js";
import {
    getOtpHtml,
    getVerifyEmailHtml,
    getPasswordResetHtml
} from "../templates/emails.js";

export const sendOtpEmail = async ({ email, otp }) => {
    const html = getOtpHtml({ email, otp });
    await sendMail({ email, subject: "Your OTP for verification", html });
};

export const sendVerificationEmail = async ({ email, token }) => {
    const html = getVerifyEmailHtml({ email, token });
    await sendMail({ email, subject: "Verify your email to finish signing up", html });
};

export const sendPasswordResetEmail = async ({ email, token }) => {
    const html = getPasswordResetHtml({ email, token });
    await sendMail({ email, subject: "Reset your password", html });
};

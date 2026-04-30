import { createTransport } from "nodemailer";
import { env } from "./env.js";

let cached = null;

const getTransport = () => {
    if (cached) return cached;
    cached = createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.secure,
        auth: {
            user: env.smtp.user,
            pass: env.smtp.pass
        },
        pool: env.isProd,
        maxConnections: 3,
        maxMessages: 100
    });
    return cached;
};

const sendMail = async ({ email, subject, html }) => {
    try {
        await getTransport().sendMail({
            from: env.smtp.from,
            to: email,
            subject,
            html
        });
    } catch (err) {
        console.error("SMTP send failed:", {
            to: email,
            subject,
            host: env.smtp.host,
            reason: err.message
        });
        const wrapped = new Error("Failed to send email. Please try again in a moment.");
        wrapped.statusCode = 502;
        wrapped.code = "EMAIL_SEND_FAILED";
        throw wrapped;
    }
};

export default sendMail;

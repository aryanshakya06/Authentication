import { createTransport } from 'nodemailer';

const sendMail = async ({ email, subject, html }) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transport.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject,
            html
        });
    } catch (err) {
        console.error("SMTP send failed:", {
            to: email,
            subject,
            reason: err.message
        });
        const wrapped = new Error("Failed to send email. Please try again in a moment.");
        wrapped.statusCode = 502;
        wrapped.code = "EMAIL_SEND_FAILED";
        throw wrapped;
    }
}

export default sendMail;

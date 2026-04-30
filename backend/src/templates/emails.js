// Modern, professional, mail-client-safe email templates.
//
// Design intent (different from the previous dark-header look):
//   - Soft neutral page (#f5f5f7) with a clean white card.
//   - Brand mark + thin two-color gradient rule at the top of the card.
//   - Generous whitespace, refined typography, no boxes-inside-boxes.
//   - OTP rendered as oversized, letter-spaced monospace numerals.
//   - All layout uses tables + inline styles for Outlook / iOS / Gmail.
//   - System font stack so Inter renders where supported, falls back gracefully.
//
// Each public function returns a complete HTML document.

const escape = (s = "") =>
    String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const APP_NAME = () => process.env.APP_NAME || "Authly";
const FRONTEND = () =>
    (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");

// Shared layout shell.
// `pretitle` is a short uppercase eyebrow (e.g. "Account verification").
// `headline` is the big H1 line.
// `body` is the inline HTML for the main content area.
// `cta` is optional { label, url } for a primary button.
// `meta` is an array of small footer metadata strings shown above the legal footer.
const shell = ({ pretitle, headline, preview, body, cta, meta = [] }) => {
    const app = APP_NAME();
    const year = new Date().getFullYear();
    const ctaBlock = cta
        ? `
    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="left" style="margin:24px 0 8px;">
      <tr>
        <td align="center" bgcolor="#4f46e5" style="border-radius:8px;background:linear-gradient(90deg,#4f46e5 0%,#a855f7 50%,#ec4899 100%);">
          <a href="${cta.url}" target="_blank" rel="noopener"
             style="display:inline-block;padding:14px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:14px;font-weight:600;line-height:1;letter-spacing:0.2px;color:#ffffff !important;text-decoration:none;border-radius:8px;">
            ${escape(cta.label)}
          </a>
        </td>
      </tr>
    </table>`
        : "";

    const metaBlock = meta.length
        ? `<p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
        ${meta.map(escape).join(" &middot; ")}
       </p>`
        : "";

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>${escape(app)}</title>
<!--[if mso]>
<style type="text/css">
  body, table, td, p, a { font-family: 'Segoe UI', Arial, sans-serif !important; }
</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background:#f5f5f7;">
  <!-- Hidden preheader for inbox preview text -->
  <div style="display:none;font-size:1px;color:#f5f5f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${escape(preview || "")}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f7" style="background:#f5f5f7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Outer card -->
        <table role="presentation" width="560" border="0" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #ececf1;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(17,24,39,0.04);">

          <!-- Brand row -->
          <tr>
            <td style="padding:28px 36px 0 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td bgcolor="#4f46e5" style="background:#4f46e5;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                          <span style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:16px;font-weight:700;color:#ffffff;line-height:32px;">A</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:15px;font-weight:600;color:#111827;letter-spacing:-0.01em;">
                            ${escape(app)}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gradient rule -->
          <tr>
            <td style="padding:18px 36px 0 36px;">
              <div style="height:3px;background:linear-gradient(90deg,#4f46e5 0%,#a855f7 50%,#ec4899 100%);border-radius:2px;line-height:3px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Eyebrow + headline -->
          <tr>
            <td style="padding:24px 36px 0 36px;">
              <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:11px;line-height:1.4;color:#6366f1;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">
                ${escape(pretitle)}
              </p>
              <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:26px;line-height:1.2;color:#111827;font-weight:700;letter-spacing:-0.02em;">
                ${escape(headline)}
              </h1>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:18px 36px 0 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:15px;line-height:1.65;color:#374151;">
              ${body}
              ${ctaBlock}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 36px 0 36px;">
              <div style="height:1px;background:#ececf1;line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 36px 28px 36px;">
              ${metaBlock}
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                &copy; ${year} ${escape(app)} &middot; Sent because you have an account or requested this action.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const getOtpHtml = ({ email, otp }) => {
    const safeEmail = escape(email);
    const otpDigits = String(otp).split("").map(escape).join('<span style="display:inline-block;width:0.18em;">&nbsp;</span>');
    const body = `
      <p style="margin:0 0 18px;">
        Use the verification code below to finish signing in to your account
        <strong style="color:#111827;">${safeEmail}</strong>.
      </p>

      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
          <td align="center" style="padding:8px 0 4px;">
            <div style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:42px;font-weight:700;color:#111827;letter-spacing:0.12em;line-height:1.1;background:linear-gradient(90deg,#4f46e5 0%,#a855f7 50%,#ec4899 100%);-webkit-background-clip:text;background-clip:text;color:transparent;mso-text-raise:0;">
              ${otpDigits}
            </div>
            <!--[if mso]>
            <div style="font-family:Consolas,monospace;font-size:42px;font-weight:700;color:#4f46e5;letter-spacing:0.12em;">
              ${escape(otp)}
            </div>
            <![endif]-->
          </td>
        </tr>
      </table>

      <p style="margin:18px 0 0;color:#6b7280;font-size:13px;">
        This code expires in <strong style="color:#111827;">5 minutes</strong> and may only be used once.
      </p>
      <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">
        Didn&rsquo;t request this? You can safely ignore the email &mdash; no action is required.
      </p>
    `;

    return shell({
        pretitle: "Verification code",
        headline: "Confirm it&rsquo;s you",
        preview: `Your one-time code is ${otp}. Expires in 5 minutes.`,
        body,
        meta: [
            "Code valid for 5 minutes",
            "Single-use",
            `Requested for ${escape(email)}`
        ]
    });
};

export const getVerifyEmailHtml = ({ email, token }) => {
    const verifyUrl = `${FRONTEND()}/token/${encodeURIComponent(token)}`;
    const body = `
      <p style="margin:0 0 12px;">
        You&rsquo;re almost done. Click the button below to verify
        <strong style="color:#111827;">${escape(email)}</strong> and finish creating your ${escape(APP_NAME())} account.
      </p>
      <p style="margin:0;color:#6b7280;font-size:13px;">
        For your safety, this link expires in <strong style="color:#111827;">5 minutes</strong> and works only once.
      </p>

      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top:20px;">
        <tr>
          <td style="padding:14px 16px;background:#f9fafb;border:1px solid #ececf1;border-radius:10px;font-family:'SFMono-Regular',Consolas,Menlo,monospace;font-size:12px;color:#6b7280;word-break:break-all;line-height:1.5;">
            If the button doesn&rsquo;t work, paste this link into your browser:<br />
            <a href="${verifyUrl}" target="_blank" rel="noopener" style="color:#4f46e5;text-decoration:none;">${escape(verifyUrl)}</a>
          </td>
        </tr>
      </table>
    `;

    return shell({
        pretitle: "Account verification",
        headline: "Verify your email address",
        preview: `Click to verify ${email} and activate your account.`,
        body,
        cta: { label: "Verify my email", url: verifyUrl },
        meta: [
            "Link valid for 5 minutes",
            "Single-use",
            `Sent to ${escape(email)}`
        ]
    });
};

export const getPasswordResetHtml = ({ email, token }) => {
    const resetUrl = `${FRONTEND()}/reset-password/${encodeURIComponent(token)}`;
    const body = `
      <p style="margin:0 0 12px;">
        We received a request to reset the password for
        <strong style="color:#111827;">${escape(email)}</strong>. Click the button below to choose a new one.
      </p>
      <p style="margin:0;color:#6b7280;font-size:13px;">
        This link is valid for <strong style="color:#111827;">15 minutes</strong>. After you reset, all of your active sessions will be signed out as a precaution.
      </p>

      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top:20px;">
        <tr>
          <td style="padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;font-size:13px;color:#9a3412;line-height:1.55;">
            <strong style="color:#7c2d12;">Didn&rsquo;t request this?</strong> You can ignore this email &mdash; your password won&rsquo;t change. If this happens repeatedly, consider rotating your password and reviewing your sessions.
          </td>
        </tr>
      </table>

      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top:14px;">
        <tr>
          <td style="padding:14px 16px;background:#f9fafb;border:1px solid #ececf1;border-radius:10px;font-family:'SFMono-Regular',Consolas,Menlo,monospace;font-size:12px;color:#6b7280;word-break:break-all;line-height:1.5;">
            If the button doesn&rsquo;t work, paste this link into your browser:<br />
            <a href="${resetUrl}" target="_blank" rel="noopener" style="color:#4f46e5;text-decoration:none;">${escape(resetUrl)}</a>
          </td>
        </tr>
      </table>
    `;

    return shell({
        pretitle: "Password reset",
        headline: "Choose a new password",
        preview: `Tap to reset your ${APP_NAME()} password. Link expires in 15 minutes.`,
        body,
        cta: { label: "Reset my password", url: resetUrl },
        meta: [
            "Link valid for 15 minutes",
            "Single-use",
            `Sent to ${escape(email)}`
        ]
    });
};

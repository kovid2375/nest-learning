export interface BaseTemplateOptions {
    appName?: string;
    title: string;
    preheader?: string;
    contentHtml: string;
}

export function baseEmailTemplate({
    appName = 'NestJS App',
    title,
    preheader = '',
    contentHtml,
}: BaseTemplateOptions): string {
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .header-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 36px 32px;
      line-height: 1.6;
      font-size: 15px;
      color: #cbd5e1;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .otp-card {
      margin: 28px 0;
      background: #1e293b;
      border: 1px dashed #6366f1;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #818cf8;
      margin: 8px 0;
      display: inline-block;
    }
    .otp-expiry {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .btn-container {
      margin: 32px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
      transition: all 0.2s ease-in-out;
    }
    .info-box {
      background: rgba(99, 102, 241, 0.08);
      border-left: 4px solid #6366f1;
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 24px 0;
      font-size: 14px;
      color: #cbd5e1;
    }
    .footer {
      border-top: 1px solid #1f2937;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      background: #0f172a;
    }
    .footer a {
      color: #818cf8;
      text-decoration: none;
    }
    .alt-link {
      word-break: break-all;
      color: #818cf8;
      font-size: 13px;
    }
  </style>
</head>
<body>
  ${preheader ? `<span style="display:none;font-size:1px;color:#0b0f19;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-badge">${appName}</div>
        <h1 class="header-title">${title}</h1>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin: 0 0 8px 0;">This email was sent by <strong>${appName}</strong>.</p>
        <p style="margin: 0;">If you didn't request this action, please secure your account or disregard this email.</p>
        <p style="margin: 12px 0 0 0; font-size: 11px; color: #475569;">© ${currentYear} ${appName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function verifyEmailTemplate(name: string, verificationUrl: string): { html: string; text: string } {
    const contentHtml = `
      <div class="greeting">Welcome aboard, ${name}! 👋</div>
      <p>Thank you for signing up with us. To activate your account and start using all the features, please verify your email address below.</p>
      
      <div class="btn-container">
        <a href="${verificationUrl}" class="btn" target="_blank">Verify My Email</a>
      </div>

      <div class="info-box">
        ⏱️ For security reasons, this verification link will expire soon.
      </div>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
        Button not working? Copy and paste this link into your browser:
        <br />
        <a href="${verificationUrl}" class="alt-link">${verificationUrl}</a>
      </p>
    `;

    const text = `Hello ${name},

Thank you for registering! Please verify your email address by clicking the link below:
${verificationUrl}

If you didn't create this account, you can safely ignore this email.`;

    return {
        html: baseEmailTemplate({
            title: 'Verify Your Email Address',
            preheader: 'Complete your registration by verifying your email address.',
            contentHtml,
        }),
        text,
    };
}

export function sendOtpTemplate(name: string, otp: string): { html: string; text: string } {
    const contentHtml = `
      <div class="greeting">Hello ${name},</div>
      <p>We received a request to verify your identity using a One-Time Password (OTP). Please use the secure verification code below:</p>
      
      <div class="otp-card">
        <span style="font-size: 13px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em;">Your One-Time Code</span>
        <div>
          <span class="otp-code">${otp}</span>
        </div>
        <div class="otp-expiry">⏳ Valid for <strong>10 minutes</strong>. Do not share this code with anyone.</div>
      </div>

      <div class="info-box">
        🔒 <strong>Security Tip:</strong> Our team will never ask you for your verification code.
      </div>

      <p style="font-size: 13px; color: #94a3b8;">If you did not request this OTP, you can safely ignore this message or review your account security.</p>
    `;

    const text = `Hello ${name},

Your one-time verification code (OTP) is: ${otp}

This code is valid for 10 minutes. Please do not share it with anyone.
If you did not request this code, please ignore this email.`;

    return {
        html: baseEmailTemplate({
            title: 'Your Verification Code',
            preheader: `Your OTP is ${otp}. Valid for 10 minutes.`,
            contentHtml,
        }),
        text,
    };
}

export function resetPasswordTemplate(name: string, resetUrl: string): { html: string; text: string } {
    const contentHtml = `
      <div class="greeting">Hi ${name},</div>
      <p>We received a request to reset the password associated with your account. Click the button below to choose a new password:</p>
      
      <div class="btn-container">
        <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
      </div>

      <div class="info-box">
        ⏱️ <strong>Note:</strong> This link is valid for <strong>15 minutes</strong> and can only be used once.
      </div>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
        Button not working? Copy and paste this URL into your browser:
        <br />
        <a href="${resetUrl}" class="alt-link">${resetUrl}</a>
      </p>

      <p style="font-size: 13px; color: #94a3b8;">If you did not make this request, please disregard this email. Your password will remain unchanged.</p>
    `;

    const text = `Hi ${name},

You requested to reset your password. Click the link below to set a new password:
${resetUrl}

This link will expire in 15 minutes.
If you did not request this, please ignore this email.`;

    return {
        html: baseEmailTemplate({
            title: 'Password Reset Request',
            preheader: 'Instructions to reset your password.',
            contentHtml,
        }),
        text,
    };
}

export function otpVerifiedSuccessTemplate(name: string): { html: string; text: string } {
    const contentHtml = `
      <div class="greeting">Congratulations, ${name}! 🎉</div>
      <p>Your email address has been successfully verified via OTP. Your account is now in full standing and ready to use.</p>

      <div class="info-box" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.1);">
        ✅ <strong>Status:</strong> Email Verified Successfully
      </div>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">If you did not perform this action, please contact our support team immediately.</p>
    `;

    const text = `Congratulations ${name}!

Your email address has been successfully verified via OTP.
If you did not perform this action, please contact support immediately.`;

    return {
        html: baseEmailTemplate({
            title: 'Email Verified Successfully',
            preheader: 'Your email address has been successfully verified.',
            contentHtml,
        }),
        text,
    };
}

export function passwordResetSuccessTemplate(name: string): { html: string; text: string } {
    const contentHtml = `
      <div class="greeting">Hello ${name},</div>
      <p>The password for your account has been successfully changed.</p>

      <div class="info-box" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.1);">
        🔒 <strong>Security Notice:</strong> All existing active sessions have been signed out.
      </div>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">If you did not make this change, please reset your password immediately or reach out to our security team.</p>
    `;

    const text = `Hello ${name},

Your account password has been successfully reset.
If you did not make this change, please reset your password immediately.`;

    return {
        html: baseEmailTemplate({
            title: 'Password Changed Successfully',
            preheader: 'Your account password has been updated.',
            contentHtml,
        }),
        text,
    };
}


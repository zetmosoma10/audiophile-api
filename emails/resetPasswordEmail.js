export function resetPasswordEmail(customer, resetLink) {
  return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd;">
                    <div style="text-align: center; padding: 20px; background-color: #007bff; color: #ffffff; border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; font-size: 24px;">Reset Your Password</h1>
                    </div>
                    <div style="padding: 20px; color: #333; line-height: 1.5;">
                        <p>Hi ${customer.firstName},</p>
                        <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <div style="text-align: center;">
                        <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 16px;">Reset Password</a>
                    </div>
                        <p>If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.</p>
                        <p>Thank you,<br>The Tech Gurus Team</p>
                    </div>
                    <div style="padding: 10px; text-align: center; font-size: 12px; color: #999; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tech Gurus. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>`;
}

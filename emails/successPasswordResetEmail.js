export function successPasswordResetEmail(customer) {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd;">
          <div style="padding: 20px; background-color: #28a745; color: #ffffff; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Password Reset Successful</h1>
          </div>
          <div style="padding: 20px; color: #333; line-height: 1.5;">
            <p>Hi ${customer.firstName},</p>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <p>If you didn’t perform this action, contact our support team immediately.</p>
            <p>Thank you,<br>The Audiophile support Team</p>
          </div>
          <footer style="padding: 10px; text-align: center; font-size: 12px; color: #999; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} audiophile. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>`;
}

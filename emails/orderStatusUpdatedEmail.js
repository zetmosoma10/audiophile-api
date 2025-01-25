export function orderStatusUpdatedEmail(order) {
  return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd;">
                    <header style="padding: 20px; background-color: #007bff; color: #ffffff; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Order Status Update</h1>
                    </header>
                    <main style="padding: 20px; color: #333; line-height: 1.5;">
                        <p>Hi ${order.name},</p>
                        <p>Your order <strong>#${
                          order.orderNumber
                        }</strong> is <strong>${order.status}</strong>.</p>
                        <p>Please contact us if you have any questions regarding your order.</p>
                        <p>Thank you for choosing Audio Store!<br>The Tech Gurus Team</p>
                    </main>
                    <footer style="padding: 10px; text-align: center; font-size: 12px; color: #999; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tech Gurus. All rights reserved.</p>
                    </footer>
                </div>
            </body>
        </html>`;
}

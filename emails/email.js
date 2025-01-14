import nodemailer from "nodemailer";

export async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "audiogurus@support.co.za",
    to: options.clientEmail,
    subject: options.subject,
    html: options.htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

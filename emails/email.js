import nodemailer from "nodemailer";

export async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICES,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: {
      name: "Audiophile",
      address: process.env.EMAIL_USER,
    },
    to: options.clientEmail,
    subject: options.subject,
    html: options.htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
   }
  });

  const mailOptions = {
    from: process.env.SMTP_USER, // Sender address
    to: email, // List of recipients
    subject: subject, // Subject line
    text: message, // Plain text body
  };

  await transporter.sendMail(mailOptions);
};

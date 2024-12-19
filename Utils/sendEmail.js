import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
      port: process.env.SMTP_PORT, // e.g., 587
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTP username (e.g., your email)
        pass: process.env.SMTP_PASS, // SMTP password (e.g., your email password or app-specific password)
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL, // Sender address
      to: email, // Receiver address
      subject, // Subject line
      text: message, // Plain text body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;

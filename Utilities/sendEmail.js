import { TryCatch } from "../middlewares/error.js";
import nodemailer from 'nodemailer'

export const sendEmail = TryCatch(async({email, subject, message})=>{
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: 'TeamUp Support <no-reply@teamup.com>',
        to: email,
        subject,
        text: message,
    });
})
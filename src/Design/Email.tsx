import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { render } from "@react-email/render";
import OtpEmail from "../Design/OtpEmail";
import React from "react";
import WelcomeEmail from "../Design/Welcome";
dotenv.config();
interface SendEmailOptions {
  to: string;
  subject: string;
  otp: string;
}

interface WelcomeEmailOptions {
  to: string;
  subject: string;
  name: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail({ to, subject, otp }: SendEmailOptions) {
  const emailHtml = await render(<OtpEmail otp={otp} />);
  await transporter.sendMail({
    from: `Futurerify <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: emailHtml,
  });
}

export async function welcomeEmail({ to, subject, name }: WelcomeEmailOptions) {
  const emailHtml = await render(<WelcomeEmail name={name} />);
  await transporter.sendMail({
    from: `Futurerify <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: emailHtml,
  });
}
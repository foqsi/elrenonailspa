// src/app/api/contact/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactFormData;

    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"El Reno Nail Spa Website" <${process.env.SMTP_FROM}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `
New contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>

          <hr />

          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}
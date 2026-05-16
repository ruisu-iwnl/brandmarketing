import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getInquiryMerchantEmail, getInquiryCustomerEmail } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { name, email, message, _honey } = await req.json();

    if (_honey) {
      console.log('Bot detected via honeypot');
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 1. Send Inquiry Notification to Merchant
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Inquiry from ${name} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}`,
      html: getInquiryMerchantEmail({ name, email, message }),
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
    });

    // 2. Send Autoreply Thank You to Customer
    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Thank you for contacting ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}`,
      html: getInquiryCustomerEmail({ name }),
      text: `Hello ${name}, thank you for reaching out! We have received your message and will get back to you shortly.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

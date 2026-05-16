import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #fcfcfc; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #ffeff3; padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 0.2em; color: #1a1a1a;">${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}</h1>
          <p style="margin: 8px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #888;">New Message</p>
        </div>
        <div style="padding: 40px; color: #333;">
          <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 24px; color: #1a1a1a;">New Message Received</h2>
          
          <div style="margin-bottom: 24px;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 4px;">From</p>
            <p style="font-size: 14px; margin: 0;"><strong>${name}</strong> (${email})</p>
          </div>

          <div style="margin-bottom: 32px;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 4px;">Message</p>
            <p style="font-size: 15px; line-height: 1.6; margin: 0; font-style: italic; color: #444;">"${message}"</p>
          </div>

          <div style="border-top: 1px solid #eee; pt-24px; padding-top: 24px;">
            <p style="font-size: 12px; color: #999; margin: 0;">This inquiry was sent from the official ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"} storefront contact form.</p>
          </div>
        </div>
      </div>
    `;

    // Send notification to you
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Inquiry from ${name} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}`,
      html: htmlContent,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
    });

    // Send Autoreply to Customer
    const thankYouHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #fcfcfc; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #ffeff3; padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 0.2em; color: #1a1a1a;">${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}</h1>
          <p style="margin: 8px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #888;">Message Received</p>
        </div>
        <div style="padding: 40px; color: #333; text-align: center;">
          <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 16px; color: #1a1a1a;">Thank you for reaching out, ${name.split(' ')[0]}.</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 32px;">
            We have received your message and will get back to you as soon as possible. 
            In the meantime, feel free to explore our latest handcrafted pieces.
          </p>
          <div style="border-top: 1px solid #eee; padding-top: 24px;">
            <p style="font-size: 12px; color: #999; margin: 0;">&copy; 2026 ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Thank you for contacting ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}`,
      html: thankYouHtml,
      text: `Hello ${name}, thank you for reaching out! We have received your message and will get back to you shortly.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

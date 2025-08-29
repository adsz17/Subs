import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { name, email, message } = parsed.data;
  try {
    await prisma.contactMessage.create({ data: { name, email, message } });
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: process.env.EMAIL_FROM || 'owner@example.com',
        subject: `Nuevo mensaje de ${name}`,
        replyTo: email,
        text: message
      });
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_FROM,
        subject: `Nuevo mensaje de ${name}`,
        replyTo: email,
        text: message
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
  }
}

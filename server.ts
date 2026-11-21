import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const RECIPIENT_EMAIL = (
  process.env.CONTACT_RECIPIENT_EMAIL || 'alderstudiosx@gmail.com'
).trim();

const ALLOWED_TOPICS = new Set([
  'Product & Web',
  'Spatial & Brand',
  'Frontier Tech',
  'General Question',
]);

interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
}

function buildMailtoUrl(payload: ContactPayload): string {
  const subject = `[Alder Inquiry · ${payload.topic}] from ${payload.name}`;
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Topic: ${payload.topic}`,
    '',
    payload.message,
  ].join('\n');

  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendViaResend(payload: ContactPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL?.trim() || 'Alder Studio <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [RECIPIENT_EMAIL],
      reply_to: payload.email,
      subject: `[Alder Inquiry · ${payload.topic}] from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nTopic: ${payload.topic}\n\n${payload.message}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }

  return true;
}

async function sendViaSmtp(payload: ContactPayload): Promise<boolean> {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return false;

  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${payload.name}" <${user}>`,
    to: RECIPIENT_EMAIL,
    replyTo: payload.email,
    subject: `[Alder Inquiry · ${payload.topic}] from ${payload.name}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\nTopic: ${payload.topic}\n\n${payload.message}`,
  });

  return true;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/contact', async (req, res) => {
    const rawName = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const rawTopic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';
    const rawMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!rawName || rawName.length > 120) {
      res.status(400).json({ error: 'Please enter a valid name.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) || rawEmail.length > 180) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const topic = ALLOWED_TOPICS.has(rawTopic) ? rawTopic : 'General Question';

    if (rawMessage.length < 8 || rawMessage.length > 4000) {
      res
        .status(400)
        .json({ error: 'Please share a brief note (between 8 and 4,000 characters).' });
      return;
    }

    const payload: ContactPayload = {
      name: rawName,
      email: rawEmail,
      topic,
      message: rawMessage,
    };

    try {
      const sentByResend = await sendViaResend(payload);
      const sentBySmtp = sentByResend ? false : await sendViaSmtp(payload);
      const delivered = sentByResend || sentBySmtp;

      res.status(200).json({
        ok: true,
        delivered,
        recipient: RECIPIENT_EMAIL,
        mailtoUrl: buildMailtoUrl(payload),
      });
    } catch (err) {
      console.error('Failed to send contact email:', err);
      res.status(200).json({
        ok: true,
        delivered: false,
        recipient: RECIPIENT_EMAIL,
        mailtoUrl: buildMailtoUrl(payload),
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

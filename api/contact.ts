import nodemailer from 'nodemailer';

interface ApiRequest {
  method?: string;
  body?: Record<string, unknown> | string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const RECIPIENT_EMAIL = (
  process.env.CONTACT_RECIPIENT_EMAIL || 'alderstudiosx@gmail.com'
).trim();

const ALLOWED_TOPICS = new Set([
  'Product & Web',
  'Spatial & Brand',
  'Frontier Tech',
  'General Question',
]);

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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let parsedBody: Record<string, unknown> = {};
  if (typeof req.body === 'string') {
    try {
      parsedBody = JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      res.status(400).json({ error: 'Invalid JSON request body.' });
      return;
    }
  } else if (req.body && typeof req.body === 'object') {
    parsedBody = req.body;
  }

  const rawName = typeof parsedBody.name === 'string' ? parsedBody.name.trim() : '';
  const rawEmail = typeof parsedBody.email === 'string' ? parsedBody.email.trim() : '';
  const rawTopic = typeof parsedBody.topic === 'string' ? parsedBody.topic.trim() : '';
  const rawMessage = typeof parsedBody.message === 'string' ? parsedBody.message.trim() : '';

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
}

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { contactSchema, webBuySolarSchema } from '@/lib/validators/contact';
import { ContactEmail } from '@/emails/ContactEmail';
import { WeBuySolarEmail } from '@/emails/WeBuySolarEmail';

const FROM = 'Phoenix Energy <noreply@phoenixenergy.solutions>';
const TO = 'info@phoenixenergy.solutions';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured');
  return new Resend(key);
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    { method: 'POST' },
  );
  const data = (await res.json()) as { success: boolean; score: number };
  return data.success && data.score >= 0.5;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const raw = body as { intent?: string; recaptchaToken?: string };

  // Verify reCAPTCHA
  if (raw.recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
    const valid = await verifyRecaptcha(raw.recaptchaToken);
    if (!valid) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }
  }

  // ─── WeBuySolar ────────────────────────────────────────────────────────────
  if (raw.intent === 'webuysolar') {
    const parsed = webBuySolarSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 422 });
    }
    const d = parsed.data;

    const html = await render(
      WeBuySolarEmail({
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone,
        valuation: d.valuation,
      }),
    );

    const { error } = await getResend().emails.send({
      from: FROM,
      to: TO,
      replyTo: d.email,
      subject: `[WeBuySolar] ${d.valuation.kw}kWp system — ${d.firstName} ${d.lastName ?? ''}`.trim(),
      html,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // ─── Client / Partner / Investor ───────────────────────────────────────────
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;
  const intentLabel = d.intent.charAt(0).toUpperCase() + d.intent.slice(1);

  const html = await render(
    ContactEmail({
      intent: d.intent,
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      company: d.company,
      location: d.location,
      message: d.message,
    }),
  );

  const { error } = await getResend().emails.send({
    from: FROM,
    to: TO,
    replyTo: d.email,
    subject: `[${intentLabel}] ${d.firstName} ${d.lastName} — ${d.company} — ${d.location}`,
    html,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

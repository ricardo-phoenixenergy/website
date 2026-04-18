import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema, webBuySolarSchema } from '@/lib/validators/contact';

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

  // Route by intent
  if (raw.intent === 'webuysolar') {
    const parsed = webBuySolarSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 422 });
    }
    const d = parsed.data;
    const { error } = await getResend().emails.send({
      from: FROM,
      to: TO,
      replyTo: d.email,
      subject: `[WeBuySolar] ${d.valuation.kw}kWp system — ${d.firstName} ${d.lastName ?? ''} — est. R${Math.round(d.valuation.indicativeValue / 1000)}k`,
      text: [
        `Intent: WeBuySolar valuation request`,
        `Name: ${d.firstName} ${d.lastName ?? ''}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone ?? 'Not provided'}`,
        '',
        '--- VALUATION SUMMARY ---',
        `System: ${d.valuation.kw} kWp, installed ${d.valuation.installYear}`,
        `BESS: ${d.valuation.bessKwh > 0 ? `${d.valuation.bessKwh} kWh` : 'None'}`,
        `Panel tier: ${d.valuation.tier}`,
        `Province: ${d.valuation.province}`,
        `Indicative value: R${d.valuation.indicativeValue.toLocaleString()}`,
        `Range: R${d.valuation.rangeLow.toLocaleString()} – R${d.valuation.rangeHigh.toLocaleString()}`,
        `10-yr DCF: R${d.valuation.dcfValue.toLocaleString()}`,
      ].join('\n'),
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // Client / Partner / Investor
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;
  const intentLabel = d.intent.charAt(0).toUpperCase() + d.intent.slice(1);

  const { error } = await getResend().emails.send({
    from: FROM,
    to: TO,
    replyTo: d.email,
    subject: `[${intentLabel}] ${d.firstName} ${d.lastName} — ${d.company} — ${d.location}`,
    text: [
      `Intent: ${intentLabel}`,
      `Name: ${d.firstName} ${d.lastName}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone}`,
      `Company: ${d.company}`,
      `Location: ${d.location}`,
      d.message ? `\nMessage:\n${d.message}` : '',
    ].join('\n'),
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

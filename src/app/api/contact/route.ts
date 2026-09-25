import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { contactSchema, webBuySolarSchema } from '@/lib/validators/contact';
import { REFUSAL, SUBJECT_FLAG, checkRecaptcha, missingRecaptchaKeys, type SiteVerifyAnswer } from '@/lib/recaptchaCheck';
import { ContactEmail } from '@/emails/ContactEmail';
import { WeBuySolarEmail } from '@/emails/WeBuySolarEmail';

const FROM = 'Phoenix Energy <noreply@phoenixenergy.solutions>';
const TO = 'info@phoenixenergy.solutions';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured');
  return new Resend(key);
}

/** Google's verdict on a token. Throws when Google can't be reached, which checkRecaptcha accepts and marks. */
async function siteVerify(secret: string, token: string): Promise<SiteVerifyAnswer> {
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    const answer = (await res.json()) as SiteVerifyAnswer;
    if (!answer.success) console.warn('[contact] reCAPTCHA did not verify the token:', answer['error-codes'] ?? []);
    return answer;
  } catch (err) {
    console.error('[contact] reCAPTCHA verify threw:', err);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const raw = body as { intent?: string; recaptchaToken?: unknown };

  // The site key is read the way the browser bundle reads it (inlined at build
  // time), so the route and the forms agree on whether reCAPTCHA is on.
  const setup = {
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  };
  const spam = await checkRecaptcha(setup, raw.recaptchaToken, siteVerify);
  const refusal = REFUSAL[spam];
  if (refusal) {
    return NextResponse.json({ error: refusal }, { status: 400 });
  }
  if (spam === 'unconfigured') {
    const missing = missingRecaptchaKeys(setup);
    const why = missing.length > 0
      ? `${missing.join(' and ')} not set; the site key is read at build time`
      : 'Google rejected RECAPTCHA_SECRET_KEY';
    console.warn(
      `[contact] reCAPTCHA is not fully configured (${why}). This enquiry was accepted without a spam check ` +
        'and marked in its subject. Set both keys in the deployment environment and redeploy.',
    );
  }
  const flag = SUBJECT_FLAG[spam];

  // ─── WeBuySolar ────────────────────────────────────────────────────────────
  if (raw.intent === 'webuysolar') {
    const parsed = webBuySolarSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 422 });
    }
    const d = parsed.data;

    try {
      const html = await render(
        WeBuySolarEmail({
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          phone: d.phone,
          valuation: d.valuation,
        }),
      );

      const { data, error } = await getResend().emails.send({
        from: FROM,
        to: TO,
        replyTo: d.email,
        subject: `${flag}[WeBuySolar] ${d.valuation.kw} kWp system: ${d.firstName} ${d.lastName ?? ''}`.trim(),
        html,
      });

      if (error) {
        console.error('[contact] WeBuySolar Resend error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
      console.log('[contact] WeBuySolar email queued:', data?.id);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('[contact] WeBuySolar send threw:', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  }

  // ─── Client / Partner / Investor ───────────────────────────────────────────
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;
  const intentLabel = d.intent.charAt(0).toUpperCase() + d.intent.slice(1);

  try {
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

    const { data, error } = await getResend().emails.send({
      from: FROM,
      to: TO,
      replyTo: d.email,
      subject: `${flag}[${intentLabel}] ${d.firstName} ${d.lastName}, ${d.company}, ${d.location}`,
      html,
    });

    if (error) {
      console.error('[contact] Contact Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    console.log('[contact] Contact email queued:', data?.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Contact send threw:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

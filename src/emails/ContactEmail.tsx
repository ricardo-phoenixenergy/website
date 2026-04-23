import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
  Preview,
} from '@react-email/components';

interface Props {
  intent: 'client' | 'partner' | 'investor';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  message?: string;
}

const INTENT_LABELS: Record<Props['intent'], string> = {
  client: 'Client',
  partner: 'Partner',
  investor: 'Investor',
};

export function ContactEmail({ intent, firstName, lastName, email, phone, company, location, message }: Props) {
  const label = INTENT_LABELS[intent];

  return (
    <Html lang="en">
      <Head />
      <Preview>{label} enquiry from {firstName} {lastName} — {company}, {location}</Preview>
      <Body style={body}>
        <Container style={wrapper}>

          {/* Header */}
          <Section style={header}>
            <Text style={headerWordmark}>PHOENIX ENERGY</Text>
          </Section>

          {/* Card */}
          <Section style={card}>

            {/* Badge */}
            <Text style={badge}>{label} Enquiry</Text>

            <Heading style={heading}>New enquiry received</Heading>
            <Text style={subtext}>
              Submitted via{' '}
              <Link href="https://phoenixenergy.solutions/contact" style={inlineLink}>
                phoenixenergy.solutions/contact
              </Link>
            </Text>

            <Hr style={divider} />

            <Field label="Name"     value={`${firstName} ${lastName}`} />
            <Field label="Email"    value={email} href={`mailto:${email}`} />
            <Field label="Phone"    value={phone} />
            <Field label="Company"  value={company} />
            <Field label="Location" value={location} />

            {message && (
              <>
                <Hr style={divider} />
                <Text style={fieldLabel}>Message</Text>
                <Text style={messageBox}>{message}</Text>
              </>
            )}

            {/* Reply CTA */}
            <Hr style={divider} />
            <Text style={replyNote}>
              Reply directly to this email to respond to {firstName}.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Phoenix Energy ·{' '}
              <Link href="https://phoenixenergy.solutions" style={footerLink}>phoenixenergy.solutions</Link>
              {' '}· info@phoenixenergy.solutions
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <Section style={fieldRow}>
      <Text style={fieldLabel}>{label}</Text>
      {href ? (
        <Link href={href} style={fieldValueLink}>{value}</Link>
      ) : (
        <Text style={fieldValue}>{value}</Text>
      )}
    </Section>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#F5F5F5',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: '32px 0',
};

const wrapper: React.CSSProperties = {
  maxWidth: 560,
  margin: '0 auto',
};

const header: React.CSSProperties = {
  backgroundColor: '#39575C',
  borderRadius: '12px 12px 0 0',
  padding: '20px 32px',
};

const headerWordmark: React.CSSProperties = {
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.12em',
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
  padding: '32px 32px 24px',
  border: '1px solid #E5E7EB',
  borderTop: 'none',
};

const badge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(57,87,92,0.08)',
  color: '#39575C',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: 99,
  border: '1px solid rgba(57,87,92,0.15)',
  marginBottom: 12,
  marginTop: 0,
};

const heading: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.3,
  margin: '0 0 6px',
};

const subtext: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 13,
  margin: '0 0 4px',
};

const inlineLink: React.CSSProperties = {
  color: '#39575C',
  textDecoration: 'underline',
};

const divider: React.CSSProperties = {
  borderColor: '#E5E7EB',
  margin: '20px 0',
};

const fieldRow: React.CSSProperties = {
  marginBottom: 14,
};

const fieldLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  margin: '0 0 2px',
};

const fieldValue: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: 15,
  margin: 0,
};

const fieldValueLink: React.CSSProperties = {
  color: '#39575C',
  fontSize: 15,
  textDecoration: 'none',
};

const messageBox: React.CSSProperties = {
  backgroundColor: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#374151',
  fontSize: 14,
  lineHeight: 1.65,
  padding: '12px 16px',
  margin: 0,
  whiteSpace: 'pre-wrap',
};

const replyNote: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 12,
  margin: 0,
};

const footer: React.CSSProperties = {
  padding: '16px 0 0',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 12,
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: '#9CA3AF',
  textDecoration: 'underline',
};

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

interface ValuationSummary {
  kw: number;
  bessKwh: number;
  installYear: number;
  inverterKw?: number;
  panelBrand?: string;
  inverterBrand?: string;
  batteryBrand?: string;
  documentation?: string;
  province: string;
  indicativeValue: number;
  rangeLow: number;
  rangeHigh: number;
  dcfValue: number;
}

interface Props {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  valuation: ValuationSummary;
}

const fmt = (n: number) => `R${n.toLocaleString('en-ZA')}`;

export function WeBuySolarEmail({ firstName, lastName, email, phone, valuation }: Props) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const indicativeK = Math.round(valuation.indicativeValue / 1000);

  return (
    <Html lang="en">
      <Head />
      <Preview>{`WeBuySolar: ${fullName} — ${valuation.kw}kWp system, est. R${indicativeK}k`}</Preview>
      <Body style={body}>
        <Container style={wrapper}>

          {/* Header */}
          <Section style={header}>
            <Text style={headerWordmark}>PHOENIX ENERGY</Text>
            <Text style={headerSub}>WeBuySolar Platform</Text>
          </Section>

          {/* Card */}
          <Section style={card}>

            {/* Badge */}
            <Text style={badge}>WeBuySolar Valuation Request</Text>

            <Heading style={heading}>New valuation submitted</Heading>
            <Text style={subtext}>
              Submitted via{' '}
              <Link href="https://phoenixenergy.solutions/tools/solar-asset-valuation" style={inlineLink}>
                Solar Asset Valuation Tool
              </Link>
            </Text>

            <Hr style={divider} />

            {/* Contact */}
            <Text style={sectionTitle}>Contact Details</Text>
            <Field label="Name"  value={fullName} />
            <Field label="Email" value={email} href={`mailto:${email}`} />
            {phone && <Field label="Phone" value={phone} />}

            <Hr style={divider} />

            {/* System details */}
            <Text style={sectionTitle}>System Details</Text>
            <Field label="System size"   value={`${valuation.kw} kWp`} />
            <Field label="Inverter size" value={valuation.inverterKw ? `${valuation.inverterKw} kW` : '—'} />
            <Field label="Install year"  value={String(valuation.installYear)} />
            <Field label="Battery (BESS)" value={valuation.bessKwh > 0 ? `${valuation.bessKwh} kWh` : 'None'} />
            <Field label="Panel brand"    value={valuation.panelBrand || '—'} />
            <Field label="Inverter brand" value={valuation.inverterBrand || '—'} />
            {valuation.bessKwh > 0 && (
              <Field label="Battery brand"  value={valuation.batteryBrand || '—'} />
            )}
            <Field label="Documentation" value={valuation.documentation || '—'} />
            <Field label="Province"      value={valuation.province} />

            <Hr style={divider} />

            {/* Valuation block */}
            <Text style={sectionTitle}>Valuation Summary</Text>

            <Section style={valuationBox}>
              <Text style={valuationLabel}>Indicative value</Text>
              <Text style={valuationPrimary}>{fmt(valuation.indicativeValue)}</Text>
              <Text style={valuationRange}>
                Range: {fmt(valuation.rangeLow)} – {fmt(valuation.rangeHigh)}
              </Text>
              <Text style={valuationDcf}>10-yr DCF: {fmt(valuation.dcfValue)}</Text>
            </Section>

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
  margin: '0 0 2px',
};

const headerSub: React.CSSProperties = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: 11,
  letterSpacing: '0.06em',
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

const sectionTitle: React.CSSProperties = {
  color: '#1A1A1A',
  fontSize: 13,
  fontWeight: 700,
  margin: '0 0 12px',
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

const valuationBox: React.CSSProperties = {
  backgroundColor: '#F0F4F5',
  border: '1px solid #C5D5D7',
  borderRadius: 10,
  padding: '20px 24px',
};

const valuationLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  margin: '0 0 4px',
};

const valuationPrimary: React.CSSProperties = {
  color: '#39575C',
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.2,
  margin: '0 0 6px',
};

const valuationRange: React.CSSProperties = {
  color: '#374151',
  fontSize: 14,
  margin: '0 0 2px',
};

const valuationDcf: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 13,
  margin: 0,
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

import { z } from 'zod';

export const contactSchema = z.object({
  intent: z.enum(['client', 'partner', 'investor']),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  message: z.string().optional(),
  recaptchaToken: z.string().min(1),
});

export const webBuySolarSchema = z.object({
  intent: z.literal('webuysolar'),
  firstName: z.string().min(2),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  valuation: z.object({
    kw: z.number(),
    bessKwh: z.number(),
    installYear: z.number(),
    tier: z.string(),
    province: z.string(),
    indicativeValue: z.number(),
    rangeLow: z.number(),
    rangeHigh: z.number(),
    dcfValue: z.number(),
  }),
  recaptchaToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type WeBuySolarInput = z.infer<typeof webBuySolarSchema>;
export type ContactPayload = ContactInput | WeBuySolarInput;

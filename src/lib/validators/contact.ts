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
  // The route decides about the token (src/lib/recaptchaCheck.ts): with no site
  // key the browser sends none, and that enquiry must still get through.
  recaptchaToken: z.string().optional(),
});

export const webBuySolarSchema = z.object({
  intent: z.literal('webuysolar'),
  firstName: z.string().min(2),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  // Every answer from the valuation tool (see src/lib/valuation/labels.ts).
  valuation: z.object({
    kw: z.number().positive(),
    bessKwh: z.number().nonnegative(),
    installYear: z.number().int(),
    inverterType: z.string().optional(),
    inverterKw: z.number().positive().optional(),
    panelBrand: z.string().optional(),
    inverterBrand: z.string().optional(),
    batteryBrand: z.string().optional(),
    batteryChemistry: z.string().optional(),
    batteryHealth: z.string().optional(),
    condition: z.string().optional(),
    monitoring: z.string().optional(),
    documentation: z.string().optional(),
    province: z.string(),
  }),
  recaptchaToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type WeBuySolarInput = z.infer<typeof webBuySolarSchema>;
export type ContactPayload = ContactInput | WeBuySolarInput;

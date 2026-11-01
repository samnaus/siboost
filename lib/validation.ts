import { z } from "zod"

const email = z
  .string()
  .trim()
  .max(200)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address")

const personName = z.string().trim().min(2, "Enter your name").max(120)
const business = z.string().trim().min(2, "Enter the business name").max(160)
const website = z
  .string()
  .trim()
  .max(300)
  .regex(/^https?:\/\/.+\..+/i, "Enter a full website address, including https://")

const consent = z.literal("yes", { message: "Consent is required before we can keep these details." })

export const readinessSchema = z.object({
  websiteUrl: website,
  businessName: business,
  contactName: personName,
  email,
  consent,
  faxNumber: z.string().optional(),
})

export const enquirySchema = z.object({
  type: z.enum(["contact", "consultation"]),
  name: personName,
  email,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  businessName: business,
  websiteUrl: z.union([website, z.literal("")]).optional(),
  packageInterest: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Add a short message so we know how to help").max(5000),
  consent,
  faxNumber: z.string().optional(),
})

export const checkoutSchema = z.object({
  contactName: personName,
  email,
  businessName: business,
  websiteUrl: z.union([website, z.literal("")]).optional(),
  packageKey: z.string().trim().max(40).optional().or(z.literal("")),
  subscriptionKeys: z.array(z.string().trim().max(40)).max(4),
  consent,
  faxNumber: z.string().optional(),
})

export const billingLookupSchema = z.object({
  email,
})

export const adminLoginSchema = z.object({
  email,
  password: z.string().min(8, "Enter your password").max(200),
})

export const productUpdateSchema = z.object({
  key: z.string().trim().min(2).max(40),
  name: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(10).max(400),
  audience: z.string().trim().min(10).max(400),
  priceDollars: z.string().trim().min(1),
  badge: z.string().trim().max(40).optional().or(z.literal("")),
  cta: z.string().trim().min(2).max(60),
  features: z.string().trim().min(2).max(8000),
  footnote: z.string().trim().max(800).optional().or(z.literal("")),
  active: z.enum(["yes", "no"]),
})

export const contentUpdateSchema = z.object({
  tagline: z.string().trim().min(8).max(160),
  email,
  heroHeadline: z.string().trim().min(8).max(160),
  heroSubheadline: z.string().trim().min(20).max(500),
  readinessIntro: z.string().trim().min(20).max(800),
  about: z.string().trim().min(40).max(5000),
  demoDisclaimer: z.string().trim().min(20).max(400),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(5).max(200),
        answer: z.string().trim().min(10).max(1200),
      }),
    )
    .min(1)
    .max(20),
})

export const recordNoteSchema = z.object({
  id: z.string().trim().min(4).max(80),
  status: z.string().trim().min(2).max(40),
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
})

export function fieldErrorsFromZod(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return fieldErrors
}

export type ActionState = {
  ok: boolean
  message?: string
  formError?: string
  fieldErrors?: Record<string, string>
}

export const initialActionState: ActionState = { ok: false }

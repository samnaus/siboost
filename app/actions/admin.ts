"use server"

import { revalidatePath } from "next/cache"
import { updateTag } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_COOKIE,
  adminCredentialsMatch,
  createAdminToken,
  getAdminSession,
  sessionCookieOptions,
} from "@/lib/auth"
import { defaultSiteContent } from "@/lib/content/defaults"
import { mergeSiteContent } from "@/lib/content/merge"
import { prisma } from "@/lib/db"
import { dollarsToCents } from "@/lib/money"
import {
  adminLoginSchema,
  contentUpdateSchema,
  fieldErrorsFromZod,
  productUpdateSchema,
  recordNoteSchema,
  type ActionState,
} from "@/lib/validation"

async function requireAdmin() {
  const email = await getAdminSession()
  if (!email) redirect("/admin/login")
  return email
}

export async function loginAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error), formError: "Check the email and password." }
  }
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 16) {
    return { ok: false, formError: "Admin access is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET." }
  }
  if (!adminCredentialsMatch(parsed.data.email, parsed.data.password)) {
    return { ok: false, formError: "Those admin details don't match." }
  }
  const token = await createAdminToken(parsed.data.email.trim().toLowerCase())
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, token, sessionCookieOptions())
  redirect("/admin")
}

export async function logoutAdmin() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect("/admin/login")
}

export async function updateEnquiry(formData: FormData) {
  await requireAdmin()
  const parsed = recordNoteSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  })
  if (!parsed.success) return
  if (!["new", "in_progress", "closed"].includes(parsed.data.status)) return
  await prisma.enquiry.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status, notes: parsed.data.notes || null },
  })
  revalidatePath("/admin/enquiries")
}

export async function updateReadiness(formData: FormData) {
  await requireAdmin()
  const parsed = recordNoteSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  })
  if (!parsed.success) return
  if (!["received", "in_review", "closed"].includes(parsed.data.status)) return
  await prisma.readinessCheck.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status, notes: parsed.data.notes || null },
  })
  revalidatePath("/admin/readiness")
}

export async function updateProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const parsed = productUpdateSchema.safeParse({
    key: formData.get("key"),
    name: formData.get("name"),
    summary: formData.get("summary"),
    audience: formData.get("audience"),
    priceDollars: formData.get("priceDollars"),
    badge: formData.get("badge"),
    cta: formData.get("cta"),
    features: formData.get("features"),
    footnote: formData.get("footnote"),
    active: formData.get("active"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error), formError: "Check the product fields." }
  }
  const cents = dollarsToCents(parsed.data.priceDollars)
  if (cents === null) return { ok: false, formError: "Enter the price in dollars, such as 1999 or 299.00." }
  const features = parsed.data.features
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  if (features.length === 0) return { ok: false, formError: "Add at least one feature, one per line." }
  await prisma.product.update({
    where: { key: parsed.data.key },
    data: {
      name: parsed.data.name,
      summary: parsed.data.summary,
      audience: parsed.data.audience,
      priceExGstCents: cents,
      badge: parsed.data.badge || null,
      cta: parsed.data.cta,
      features: JSON.stringify(features),
      footnote: parsed.data.footnote || null,
      active: parsed.data.active === "yes",
    },
  })
  updateTag("products")
  revalidatePath("/packages")
  revalidatePath("/")
  return { ok: true, message: "Saved." }
}

export async function updateContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()
  const questions = formData.getAll("faqQuestion")
  const answers = formData.getAll("faqAnswer")
  const faqs = questions.flatMap((question, index) => {
    const answer = answers[index]
    if (typeof question !== "string" || typeof answer !== "string") return []
    if (!question.trim() && !answer.trim()) return []
    return [{ question, answer }]
  })
  const parsed = contentUpdateSchema.safeParse({
    tagline: formData.get("tagline"),
    email: formData.get("email"),
    heroHeadline: formData.get("heroHeadline"),
    heroSubheadline: formData.get("heroSubheadline"),
    readinessIntro: formData.get("readinessIntro"),
    about: formData.get("about"),
    demoDisclaimer: formData.get("demoDisclaimer"),
    faqs,
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error), formError: "Check the content fields." }
  }
  const current = await prisma.contentEntry.findUnique({ where: { key: "site" } })
  const existing = current ? (JSON.parse(current.value) as unknown) : {}
  const merged = mergeSiteContent(defaultSiteContent, existing)
  const prior = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {}
  const next = {
    ...prior,
    business: { ...merged.business, tagline: parsed.data.tagline, email: parsed.data.email },
    hero: { ...merged.hero, headline: parsed.data.heroHeadline, subheadline: parsed.data.heroSubheadline },
    readiness: { ...merged.readiness, intro: parsed.data.readinessIntro },
    about: {
      ...merged.about,
      paragraphs: parsed.data.about
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    },
    agent: { ...merged.agent, demoDisclaimer: parsed.data.demoDisclaimer },
    faqs: parsed.data.faqs,
  }
  await prisma.contentEntry.upsert({
    where: { key: "site" },
    create: { key: "site", value: JSON.stringify(next) },
    update: { value: JSON.stringify(next) },
  })
  updateTag("site-content")
  revalidatePath("/", "layout")
  return { ok: true, message: "Saved." }
}

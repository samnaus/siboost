"use server"

import { saveEnquiry, saveReadiness } from "@/lib/leads"
import { limitAction, text } from "@/lib/request"
import {
  enquirySchema,
  fieldErrorsFromZod,
  readinessSchema,
  type ActionState,
} from "@/lib/validation"

export async function submitReadiness(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = readinessSchema.safeParse({
    websiteUrl: text(formData, "websiteUrl"),
    businessName: text(formData, "businessName"),
    contactName: text(formData, "contactName"),
    email: text(formData, "email"),
    consent: text(formData, "consent"),
    faxNumber: text(formData, "faxNumber"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error), formError: "Please check the highlighted fields." }
  }
  if (parsed.data.faxNumber) {
    return { ok: true, message: "received" }
  }
  const limit = await limitAction("readiness")
  if (!limit.ok) {
    return { ok: false, formError: "Please wait a few minutes before sending another check." }
  }
  try {
    await saveReadiness(parsed.data)
  } catch (error) {
    console.error("[readiness]", error)
    return { ok: false, formError: "We couldn't save that just now. Please email us and we'll pick it up." }
  }
  return { ok: true, message: "received" }
}

export async function submitEnquiry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = enquirySchema.safeParse({
    type: text(formData, "type") || "contact",
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    businessName: text(formData, "businessName"),
    websiteUrl: text(formData, "websiteUrl"),
    packageInterest: text(formData, "packageInterest"),
    message: text(formData, "message"),
    consent: text(formData, "consent"),
    faxNumber: text(formData, "faxNumber"),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrorsFromZod(parsed.error), formError: "Please check the highlighted fields." }
  }
  if (parsed.data.faxNumber) return { ok: true, message: "received" }
  const limit = await limitAction("enquiry")
  if (!limit.ok) {
    return { ok: false, formError: "Please wait a few minutes before sending another message." }
  }
  try {
    await saveEnquiry({
      type: parsed.data.type,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      businessName: parsed.data.businessName,
      websiteUrl: parsed.data.websiteUrl,
      packageInterest: parsed.data.packageInterest,
      message: parsed.data.message,
    })
  } catch (error) {
    console.error("[enquiry]", error)
    return { ok: false, formError: "We couldn't save that just now. Please email us and we'll pick it up." }
  }
  return { ok: true, message: "received" }
}

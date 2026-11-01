import { prisma } from "@/lib/db"
import { enquiryEmail, sendEmail } from "@/lib/email"

export async function saveEnquiry(input: {
  type: string
  name: string
  email: string
  phone?: string
  businessName?: string
  websiteUrl?: string
  packageInterest?: string
  subscriptionInterest?: string
  message: string
}) {
  const enquiry = await prisma.enquiry.create({
    data: {
      type: input.type,
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      businessName: input.businessName || null,
      websiteUrl: input.websiteUrl || null,
      packageInterest: input.packageInterest || null,
      subscriptionInterest: input.subscriptionInterest || null,
      message: input.message,
      consent: true,
    },
  })
  await sendEmail(enquiryEmail({ to: enquiry.email, name: input.name, kind: input.type === "consultation" ? "consultation request" : "message" }))
  return enquiry
}

export async function saveReadiness(input: {
  websiteUrl: string
  businessName: string
  contactName: string
  email: string
}) {
  const check = await prisma.readinessCheck.create({
    data: {
      websiteUrl: input.websiteUrl,
      businessName: input.businessName,
      contactName: input.contactName,
      email: input.email.toLowerCase(),
      consent: true,
    },
  })
  await sendEmail(
    enquiryEmail({
      to: check.email,
      name: input.contactName,
      kind: "website readiness check",
    }),
  )
  return check
}

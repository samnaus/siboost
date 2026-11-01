import { prisma } from "@/lib/db"
import { getEmailState } from "@/lib/env"

export type EmailMessage = {
  to: string
  subject: string
  text: string
  html: string
  relatedId?: string
}

export type EmailResult = {
  status: "sent" | "logged" | "failed"
  provider: string
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const state = getEmailState()
  let result: EmailResult

  if (state.provider === "resend") {
    result = await sendResend(message)
  } else if (state.provider === "postmark") {
    result = await sendPostmark(message)
  } else {
    console.info("[email:unconfigured] Transactional email is not configured. Message logged below.")
    console.info(
      JSON.stringify(
        { to: message.to, subject: message.subject, text: message.text, relatedId: message.relatedId },
        null,
        2,
      ),
    )
    result = { status: "logged", provider: "console" }
  }

  try {
    await prisma.emailLog.create({
      data: {
        to: message.to,
        subject: message.subject,
        status: result.status,
        provider: result.provider,
        relatedId: message.relatedId,
      },
    })
  } catch (error) {
    console.error("[email] Could not write the email log", error)
  }

  return result
}

async function sendResend(message: EmailMessage): Promise<EmailResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  })
  if (!response.ok) {
    console.error("[email:resend]", response.status, await response.text())
    return { status: "failed", provider: "resend" }
  }
  return { status: "sent", provider: "resend" }
}

async function sendPostmark(message: EmailMessage): Promise<EmailResult> {
  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN || "",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      From: process.env.EMAIL_FROM,
      To: message.to,
      Subject: message.subject,
      TextBody: message.text,
      HtmlBody: message.html,
      MessageStream: "outbound",
    }),
  })
  if (!response.ok) {
    console.error("[email:postmark]", response.status, await response.text())
    return { status: "failed", provider: "postmark" }
  }
  return { status: "sent", provider: "postmark" }
}

export function orderEmail(input: {
  to: string
  contactName: string
  businessName: string
  lines: { name: string; exGst: string; interval: string | null }[]
  exGst: string
  gst: string
  total: string
  billingUrl: string
  testMode: boolean
  relatedId: string
}) {
  const itemLines = input.lines
    .map((line) => `- ${line.name}: ${line.exGst} excl. GST${line.interval ? " per month" : ""}`)
    .join("\n")
  const testNote = input.testMode
    ? "\nThis payment was taken in Stripe test mode. It is not a live charge.\n"
    : ""
  const text = `Kia ora ${input.contactName},

We've received your Siboost order for ${input.businessName}.
${testNote}
${itemLines}

Subtotal excl. GST: ${input.exGst}
GST: ${input.gst}
Total: ${input.total}

What happens next
1. We reply to confirm the project and ask for access to the website.
2. We agree the scope, then start the work in the package you chose.
3. If you added a subscription, you can manage the card, invoices and cancellation here: ${input.billingUrl}

Siboost improves how clearly a website can be understood and how easily visitors can enquire. It does not guarantee that any AI system will rank, recommend or mention the business.

— Siboost
`
  const html = `<p>Kia ora ${escapeHtml(input.contactName)},</p>
<p>We've received your Siboost order for <strong>${escapeHtml(input.businessName)}</strong>.</p>
${input.testMode ? "<p><strong>This payment was taken in Stripe test mode. It is not a live charge.</strong></p>" : ""}
<ul>${input.lines
    .map(
      (line) =>
        `<li>${escapeHtml(line.name)}: ${escapeHtml(line.exGst)} excl. GST${line.interval ? " per month" : ""}</li>`,
    )
    .join("")}</ul>
<p>Subtotal excl. GST: ${escapeHtml(input.exGst)}<br>GST: ${escapeHtml(input.gst)}<br>Total: ${escapeHtml(input.total)}</p>
<p>What happens next</p>
<ol>
<li>We reply to confirm the project and ask for access to the website.</li>
<li>We agree the scope, then start the work in the package you chose.</li>
<li>If you added a subscription, you can manage the card, invoices and cancellation here: <a href="${escapeHtml(input.billingUrl)}">${escapeHtml(input.billingUrl)}</a></li>
</ol>
<p>Siboost improves how clearly a website can be understood and how easily visitors can enquire. It does not guarantee that any AI system will rank, recommend or mention the business.</p>
<p>— Siboost</p>`

  return {
    to: input.to,
    subject: "We've received your Siboost order",
    text,
    html,
    relatedId: input.relatedId,
  }
}

export function enquiryEmail(input: { to: string; name: string; kind: string }) {
  const text = `Kia ora ${input.name},

Thanks for contacting Siboost. We've received your ${input.kind} and a person on the team will reply. We aim to respond within two business days.

This note confirms we received the form. It is not an audit result, and it does not mean an AI assistant will recommend the business.

— Siboost
`
  const html = `<p>Kia ora ${escapeHtml(input.name)},</p><p>Thanks for contacting Siboost. We've received your ${escapeHtml(input.kind)} and a person on the team will reply. We aim to respond within two business days.</p><p>This note confirms we received the form. It is not an audit result, and it does not mean an AI assistant will recommend the business.</p><p>— Siboost</p>`
  return {
    to: input.to,
    subject: "We've received your Siboost enquiry",
    text,
    html,
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

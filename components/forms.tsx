"use client"

import { useActionState } from "react"
import { submitEnquiry, submitReadiness } from "@/app/actions/forms"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { SiteContent } from "@/lib/content/types"
import { initialActionState } from "@/lib/validation"

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null
  return (
    <p id={id} role="alert" className="text-sm font-medium text-red-700">
      {children}
    </p>
  )
}

function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
      <label>
        Fax
        <input name="faxNumber" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

export function ReadinessForm({ content }: { content: SiteContent }) {
  const [state, action, pending] = useActionState(submitReadiness, initialActionState)
  if (state.ok) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h3 className="text-xl font-bold text-[#0f172a]">{content.readiness.successTitle}</h3>
        <p className="mt-2 text-base leading-7 text-slate-700">{content.readiness.successBody}</p>
      </div>
    )
  }
  const errors = state.fieldErrors ?? {}
  return (
    <form action={action} className="relative grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <Honeypot />
      {state.formError ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.formError}
        </p>
      ) : null}
      <Field id="websiteUrl" label="Website URL" error={errors.websiteUrl}>
        <Input id="websiteUrl" name="websiteUrl" type="url" required autoComplete="url" placeholder="https://example.co.nz" aria-invalid={Boolean(errors.websiteUrl)} aria-describedby={errors.websiteUrl ? "websiteUrl-error" : undefined} className="h-11 md:text-base" />
      </Field>
      <Field id="businessName" label="Business name" error={errors.businessName}>
        <Input id="businessName" name="businessName" required autoComplete="organization" aria-invalid={Boolean(errors.businessName)} className="h-11 md:text-base" />
      </Field>
      <Field id="contactName" label="Contact name" error={errors.contactName}>
        <Input id="contactName" name="contactName" required autoComplete="name" aria-invalid={Boolean(errors.contactName)} className="h-11 md:text-base" />
      </Field>
      <Field id="email" label="Email address" error={errors.email}>
        <Input id="email" name="email" type="email" required autoComplete="email" aria-invalid={Boolean(errors.email)} className="h-11 md:text-base" />
      </Field>
      <Consent error={errors.consent} />
      <Button type="submit" disabled={pending} className="h-11 rounded-full font-semibold hover:bg-[#1d4ed8]">
        {pending ? "Sending…" : "Check My Website"}
      </Button>
    </form>
  )
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initialActionState)
  if (state.ok) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h2 className="text-xl font-bold text-[#0f172a]">Message received.</h2>
        <p className="mt-2 leading-7 text-slate-700">
          Thanks. A person at Siboost will reply by email. We aim to respond within two business days. This is not an audit result.
        </p>
      </div>
    )
  }
  const errors = state.fieldErrors ?? {}
  return (
    <form action={action} className="relative grid gap-4" noValidate>
      <Honeypot />
      {state.formError ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.formError}
        </p>
      ) : null}
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">What do you need?</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="type" value="contact" defaultChecked className="size-4 accent-[#2563eb]" />
          General message
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="type" value="consultation" className="size-4 accent-[#2563eb]" />
          Request a consultation
        </label>
      </fieldset>
      <Field id="name" label="Your name" error={errors.name}>
        <Input id="name" name="name" required autoComplete="name" className="h-11 md:text-base" aria-invalid={Boolean(errors.name)} />
      </Field>
      <Field id="contact-email" label="Email address" error={errors.email}>
        <Input id="contact-email" name="email" type="email" required autoComplete="email" className="h-11 md:text-base" aria-invalid={Boolean(errors.email)} />
      </Field>
      <Field id="phone" label="Phone (optional)" error={errors.phone}>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" className="h-11 md:text-base" />
      </Field>
      <Field id="contact-business" label="Business name" error={errors.businessName}>
        <Input id="contact-business" name="businessName" required autoComplete="organization" className="h-11 md:text-base" aria-invalid={Boolean(errors.businessName)} />
      </Field>
      <Field id="contact-website" label="Website (optional)" error={errors.websiteUrl} hint="Include https:// if you add one.">
        <Input id="contact-website" name="websiteUrl" type="url" autoComplete="url" placeholder="https://" className="h-11 md:text-base" aria-invalid={Boolean(errors.websiteUrl)} />
      </Field>
      <div className="grid gap-2">
        <Label htmlFor="packageInterest">Package interest</Label>
        <select id="packageInterest" name="packageInterest" className="h-11 rounded-lg border border-input bg-white px-3 text-base" defaultValue="">
          <option value="">Not sure yet</option>
          <option value="SI Ready">SI Ready</option>
          <option value="SI Boost">SI Boost</option>
          <option value="SI Complete">SI Complete</option>
          <option value="SI Care">SI Care</option>
          <option value="SI Agent">SI Agent</option>
        </select>
      </div>
      <Field id="message" label="Message" error={errors.message}>
        <Textarea id="message" name="message" required rows={5} className="min-h-32 md:text-base" aria-invalid={Boolean(errors.message)} />
      </Field>
      <Consent error={errors.consent} />
      <Button type="submit" disabled={pending} className="h-11 rounded-full font-semibold hover:bg-[#1d4ed8]">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-sm text-slate-600">{hint}</p> : null}
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </div>
  )
}

function Consent({ error }: { error?: string }) {
  return (
    <div className="grid gap-2">
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
        <Checkbox name="consent" value="yes" required className="mt-1" aria-invalid={Boolean(error)} />
        <span>
          I agree to Siboost using these details to respond to this request. See the{" "}
          <a className="font-semibold text-[#1d4ed8] underline" href="/privacy">
            privacy policy
          </a>
          .
        </span>
      </label>
      <ErrorText id="consent-error">{error}</ErrorText>
    </div>
  )
}

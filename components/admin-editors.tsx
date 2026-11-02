"use client"

import { useActionState } from "react"
import { updateContent, updateProduct } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PublicProduct } from "@/lib/catalog"
import type { SiteContent } from "@/lib/content/types"
import { centsToDollarInput } from "@/lib/money"
import { initialActionState } from "@/lib/validation"

export function ProductEditor({ product, publiclyHidden = false }: { product: PublicProduct; publiclyHidden?: boolean }) {
  const [state, action, pending] = useActionState(updateProduct, initialActionState)
  return (
    <form action={action} className="grid gap-3 rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <span className="text-xs text-slate-500">{product.key}</span>
      </div>
      <input type="hidden" name="key" value={product.key} />
      {publiclyHidden ? (
        <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm leading-6 text-slate-700">
          Hidden on the public site while monthly subscriptions are switched off. Set SUBSCRIPTIONS_ENABLED=true to offer this again. Stripe subscription handling stays in place.
        </p>
      ) : null}
      {state.formError ? <p className="text-sm text-red-700">{state.formError}</p> : null}
      {state.ok ? <p className="text-sm text-emerald-700">Saved.</p> : null}
      <Label htmlFor={`${product.key}-name`}>Name</Label>
      <Input id={`${product.key}-name`} name="name" defaultValue={product.name} required />
      <Label htmlFor={`${product.key}-price`}>Price excl. GST (NZD)</Label>
      <Input id={`${product.key}-price`} name="priceDollars" defaultValue={centsToDollarInput(product.priceExGstCents)} required />
      <Label htmlFor={`${product.key}-summary`}>Summary</Label>
      <Textarea id={`${product.key}-summary`} name="summary" defaultValue={product.summary} required />
      <Label htmlFor={`${product.key}-audience`}>Who it is for</Label>
      <Textarea id={`${product.key}-audience`} name="audience" defaultValue={product.audience} required />
      <Label htmlFor={`${product.key}-cta`}>Button label</Label>
      <Input id={`${product.key}-cta`} name="cta" defaultValue={product.cta} required />
      <Label htmlFor={`${product.key}-badge`}>Badge (optional)</Label>
      <Input id={`${product.key}-badge`} name="badge" defaultValue={product.badge ?? ""} />
      <Label htmlFor={`${product.key}-features`}>Features, one per line</Label>
      <Textarea id={`${product.key}-features`} name="features" defaultValue={product.features.join("\n")} rows={8} required />
      <Label htmlFor={`${product.key}-footnote`}>Footnote</Label>
      <Textarea id={`${product.key}-footnote`} name="footnote" defaultValue={product.footnote ?? ""} rows={4} />
      <Label htmlFor={`${product.key}-active`}>{publiclyHidden ? "Active in the catalogue" : "Visible on the site"}</Label>
      <select id={`${product.key}-active`} name="active" defaultValue={product.active ? "yes" : "no"} className="h-10 rounded-lg border px-3">
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      <Button type="submit" disabled={pending} className="h-10 w-fit rounded-full">
        {pending ? "Saving…" : "Save product"}
      </Button>
    </form>
  )
}

export function ContentEditor({ content, subscriptionsOff }: { content: SiteContent; subscriptionsOff: boolean }) {
  const [state, action, pending] = useActionState(updateContent, initialActionState)
  return (
    <form action={action} className="grid gap-4">
      {state.formError ? <p className="text-sm text-red-700">{state.formError}</p> : null}
      {state.ok ? <p className="text-sm text-emerald-700">Saved. Public pages refresh from the updated copy.</p> : null}
      <Label htmlFor="tagline">Tagline</Label>
      <Input id="tagline" name="tagline" defaultValue={content.business.tagline} required />
      <Label htmlFor="email">Public email</Label>
      <Input id="email" name="email" type="email" defaultValue={content.business.email} required />
      <Label htmlFor="heroHeadline">Homepage headline</Label>
      <Input id="heroHeadline" name="heroHeadline" defaultValue={content.hero.headline} required />
      <Label htmlFor="heroSubheadline">Homepage subheadline</Label>
      <Textarea id="heroSubheadline" name="heroSubheadline" defaultValue={content.hero.subheadline} required />
      <Label htmlFor="readinessIntro">Readiness check introduction</Label>
      <Textarea id="readinessIntro" name="readinessIntro" defaultValue={content.readiness.intro} required />
      <Label htmlFor="about">About paragraphs</Label>
      <Textarea id="about" name="about" defaultValue={content.about.paragraphs.join("\n\n")} rows={8} required />
      <p className="text-sm text-slate-500">Separate paragraphs with a blank line.</p>
      <fieldset className="grid gap-4">
        <legend className="font-semibold">FAQs</legend>
        {content.faqs.map((faq, index) => (
          <div key={`${faq.question}-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3">
            {subscriptionsOff && /subscription|SI Care|SI Agent/i.test(`${faq.question} ${faq.answer}`) ? (
              <p className="text-sm leading-6 text-slate-600">
                Hidden on the public site while monthly subscriptions are switched off.
              </p>
            ) : null}
            <Label htmlFor={`faq-q-${index}`}>Question</Label>
            <Input id={`faq-q-${index}`} name="faqQuestion" defaultValue={faq.question} />
            <Label htmlFor={`faq-a-${index}`}>Answer</Label>
            <Textarea id={`faq-a-${index}`} name="faqAnswer" defaultValue={faq.answer} />
          </div>
        ))}
        <div className="grid gap-2 rounded-xl border border-dashed border-slate-300 p-3">
          <p className="text-sm text-slate-500">Add another FAQ. Leave both fields blank to skip.</p>
          <Input name="faqQuestion" placeholder="Question" aria-label="New FAQ question" />
          <Textarea name="faqAnswer" placeholder="Answer" aria-label="New FAQ answer" />
        </div>
      </fieldset>
      <Button type="submit" disabled={pending} className="h-10 w-fit rounded-full">
        {pending ? "Saving…" : "Save content"}
      </Button>
    </form>
  )
}

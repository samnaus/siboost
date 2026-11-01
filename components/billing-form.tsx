"use client"

import { useActionState } from "react"
import { openBillingPortal } from "@/app/actions/billing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { initialActionState } from "@/lib/validation"

export function BillingForm() {
  const [state, action, pending] = useActionState(openBillingPortal, initialActionState)
  return (
    <form action={action} className="grid max-w-md gap-4" noValidate>
      {state.formError ? (
        <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {state.formError}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="billing-email">Email address on the order</Label>
        <Input id="billing-email" name="email" type="email" required autoComplete="email" className="h-11 md:text-base" aria-invalid={Boolean(state.fieldErrors?.email)} />
        {state.fieldErrors?.email ? <p className="text-sm text-red-700">{state.fieldErrors.email}</p> : null}
      </div>
      <Button type="submit" disabled={pending} className="h-11 rounded-full font-semibold hover:bg-[#1d4ed8]">
        {pending ? "Opening…" : "Open billing portal"}
      </Button>
    </form>
  )
}

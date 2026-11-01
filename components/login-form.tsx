"use client"

import { useActionState } from "react"
import { loginAdmin } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { initialActionState } from "@/lib/validation"

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialActionState)
  return (
    <form action={action} className="grid gap-4" noValidate>
      {state.formError ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.formError}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input id="admin-email" name="email" type="email" required autoComplete="username" className="h-11" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input id="admin-password" name="password" type="password" required autoComplete="current-password" className="h-11" />
      </div>
      <Button type="submit" disabled={pending} className="h-11 rounded-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}

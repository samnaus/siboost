import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"

export async function limitAction(action: string) {
  const headerList = await headers()
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local"
  return rateLimit(`${action}:${ip}`)
}

export function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

export function isNextRedirect(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT"),
  )
}

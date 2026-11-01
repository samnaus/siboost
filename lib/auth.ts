import { timingSafeEqual } from "node:crypto"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { adminConfigured } from "@/lib/env"

export const ADMIN_COOKIE = "siboost_admin"

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value || value.length < 16) return null
  return new TextEncoder().encode(value)
}

export async function createAdminToken(email: string) {
  const key = secret()
  if (!key) throw new Error("Admin session secret is not configured.")
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key)
}

export async function readAdminToken(token: string | undefined) {
  const key = secret()
  if (!token || !key) return null
  try {
    const { payload } = await jwtVerify(token, key)
    return typeof payload.email === "string" ? payload.email : null
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const jar = await cookies()
  return readAdminToken(jar.get(ADMIN_COOKIE)?.value)
}

export function adminCredentialsMatch(email: string, password: string) {
  if (!adminConfigured()) return false
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || ""
  const expectedPassword = process.env.ADMIN_PASSWORD || ""
  return safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword)
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) {
    timingSafeEqual(a, a)
    return false
  }
  return timingSafeEqual(a, b)
}

export function sessionCookieOptions() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || ""
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: site.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 12,
  }
}

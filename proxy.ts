import { jwtVerify } from "jose"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next()
  }
  const token = request.cookies.get("siboost_admin")?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!token || !secret) {
    return redirectToLogin(request)
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return NextResponse.next()
  } catch {
    return redirectToLogin(request)
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = "/admin/login"
  url.search = ""
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}

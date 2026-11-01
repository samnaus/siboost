import { connection } from "next/server"
import { getEmailState, getPaymentsState } from "@/lib/env"

export async function GET() {
  await connection()
  return Response.json({
    ok: true,
    payments: getPaymentsState().mode,
    email: getEmailState().provider,
  })
}

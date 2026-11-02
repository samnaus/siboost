import { mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { chromium } from "playwright-core"
import { PrismaClient } from "@prisma/client"

const require = createRequire(import.meta.url)
const axeSource = require("axe-core").source
const out = "/opt/cursor/artifacts"
const base = process.env.CAPTURE_BASE || "http://127.0.0.1:4317"

await mkdir(out, { recursive: true })
const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})

const issues = []

async function shot(page, name) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false })
}

async function scan(page, name) {
  await page.addScriptTag({ content: axeSource })
  const result = await page.evaluate(async () => {
    const axe = window.axe
    const outcome = await axe.run(document, {
      resultTypes: ["violations"],
      rules: { "color-contrast": { enabled: true } },
    })
    return outcome.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.slice(0, 3).map((node) => node.html.slice(0, 220)),
      help: violation.help,
    }))
  })
  if (result.length) issues.push({ name, result })
  else console.log(`axe ok: ${name}`)
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
desktop.on("pageerror", (error) => console.log("PAGEERROR", error.message))
desktop.on("console", (message) => {
  if (message.type() === "error") console.log("CONSOLE", message.text())
})
await desktop.goto(base, { waitUntil: "networkidle" })
await shot(desktop, "homepage-desktop")
await scan(desktop, "home-desktop")

await desktop.goto(`${base}/packages`, { waitUntil: "networkidle" })
await shot(desktop, "pricing-desktop")
await scan(desktop, "pricing-desktop")

await desktop.goto(`${base}/ai-sales-agents`, { waitUntil: "networkidle" })
if (!new URL(desktop.url()).pathname.startsWith("/packages")) {
  throw new Error(`Expected /ai-sales-agents to redirect to /packages, got ${desktop.url()}`)
}
console.log("ai-sales-agents redirects to packages")

await desktop.goto(`${base}/checkout?package=si-boost`, { waitUntil: "networkidle" })
const notice = desktop.getByText("Payments are not yet configured.")
await notice.first().waitFor()
await shot(desktop, "checkout-unconfigured-desktop")

await desktop.goto(`${base}/check`, { waitUntil: "networkidle" })
await desktop.getByLabel("Website URL").fill("https://example.co.nz")
await desktop.getByLabel("Business name").fill("Example Homes")
await desktop.getByLabel("Contact name").fill("Alex Owner")
await desktop.getByLabel("Email address").fill("alex@example.co.nz")
await desktop.getByRole("checkbox", { name: /I agree to Siboost/ }).check()
await desktop.getByRole("button", { name: "Check My Website" }).click()
await desktop.getByRole("status").getByText("We've received your website.").waitFor()
console.log("readiness form submitted")

await desktop.goto(`${base}/contact`, { waitUntil: "networkidle" })
await scan(desktop, "contact-desktop")

await desktop.goto(`${base}/admin/login`, { waitUntil: "networkidle" })
await desktop.getByLabel("Email").fill("admin@siboost.test")
await desktop.getByLabel("Password").fill(process.env.ADMIN_PASSWORD || "")
await desktop.getByRole("button", { name: "Sign in" }).click()
await desktop.getByRole("heading", { name: "Overview" }).waitFor()
await desktop.goto(`${base}/admin/readiness`, { waitUntil: "networkidle" })
await desktop.getByText("example.co.nz").first().waitFor()
console.log("admin shows the readiness check")
await shot(desktop, "admin-readiness-desktop")

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await mobile.goto(base, { waitUntil: "networkidle" })
await shot(mobile, "homepage-mobile")
await scan(mobile, "home-mobile")
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
if (overflow) issues.push({ name: "home-mobile", result: [{ id: "horizontal-overflow", impact: "serious", nodes: 1 }] })

await mobile.goto(`${base}/packages`, { waitUntil: "networkidle" })
await shot(mobile, "pricing-mobile")
const pricingOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
if (pricingOverflow) issues.push({ name: "pricing-mobile", result: [{ id: "horizontal-overflow", impact: "serious", nodes: 1 }] })

await mobile.goto(`${base}/ai-sales-agents`, { waitUntil: "networkidle" })
if (!new URL(mobile.url()).pathname.startsWith("/packages")) {
  throw new Error(`Expected /ai-sales-agents to redirect to /packages, got ${mobile.url()}`)
}

await browser.close()

const prisma = new PrismaClient()
const saved = await prisma.readinessCheck.findFirst({ where: { email: "alex@example.co.nz" } })
await prisma.$disconnect()
if (!saved) issues.push({ name: "database", result: [{ id: "missing-readiness-row", impact: "critical", nodes: 1 }] })
else console.log("database stored readiness check", saved.id)

if (issues.length) {
  console.error(JSON.stringify(issues, null, 2))
  process.exit(1)
}
console.log("capture complete")

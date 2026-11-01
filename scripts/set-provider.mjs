import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const schemaPath = path.join(root, "prisma", "schema.prisma")
const url = process.env.DATABASE_URL || ""
const provider = url.startsWith("postgres") ? "postgresql" : "sqlite"
const schema = fs.readFileSync(schemaPath, "utf8")
const next = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`,
)
if (next !== schema) fs.writeFileSync(schemaPath, next)
console.log(`[prisma] provider=${provider}`)

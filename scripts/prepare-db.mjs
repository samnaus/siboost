import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function run(command) {
  execSync(command, { cwd: root, stdio: "inherit", env: process.env })
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
}

run("node scripts/set-provider.mjs")
run("npx prisma generate")
run("npx prisma db push --skip-generate --accept-data-loss")
run("npx tsx prisma/seed.ts")

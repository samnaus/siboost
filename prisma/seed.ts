import { PrismaClient } from "@prisma/client"
import { defaultCatalog, toProductCreateData } from "../lib/catalog"

const prisma = new PrismaClient()
const removedOffer = /ai sales agent|sales assistant|lead capture and qualification|approved business knowledge|automated lead follow-up/i

async function main() {
  for (const product of defaultCatalog) {
    const data = toProductCreateData(product)
    const existing = await prisma.product.findUnique({ where: { key: product.key } })
    if (!existing) {
      await prisma.product.create({ data })
      continue
    }
    const stalePackage =
      product.kind === "package" &&
      removedOffer.test(`${existing.summary}\n${existing.features}\n${existing.footnote ?? ""}`)
    if (stalePackage) {
      await prisma.product.update({
        where: { key: product.key },
        data: {
          summary: data.summary,
          audience: data.audience,
          features: data.features,
          footnote: data.footnote,
        },
      })
    }
  }
  console.log(`[seed] ${defaultCatalog.length} products ready`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

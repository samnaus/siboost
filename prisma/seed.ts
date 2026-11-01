import { PrismaClient } from "@prisma/client"
import { defaultCatalog, toProductCreateData } from "../lib/catalog"

const prisma = new PrismaClient()

async function main() {
  for (const product of defaultCatalog) {
    const data = toProductCreateData(product)
    await prisma.product.upsert({
      where: { key: product.key },
      update: {},
      create: data,
    })
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

import { cacheLife, cacheTag } from "next/cache"
import { defaultCatalog, toProductCreateData, toPublicProduct, type PublicProduct } from "@/lib/catalog"
import { prisma } from "@/lib/db"

export async function ensureSeeded() {
  const count = await prisma.product.count()
  if (count > 0) return
  try {
    await prisma.product.createMany({ data: defaultCatalog.map(toProductCreateData) })
  } catch (error) {
    console.error("[seed] Product seed skipped", error)
  }
}

export async function getProducts(): Promise<PublicProduct[]> {
  "use cache"
  cacheTag("products")
  cacheLife("hours")
  try {
    await ensureSeeded()
    const rows = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } })
    return rows.filter((row) => row.active).map(toPublicProduct)
  } catch (error) {
    console.error("[products] Using the default catalogue", error)
    return defaultCatalog.filter((product) => product.active)
  }
}

export async function getAllProducts(): Promise<PublicProduct[]> {
  await ensureSeeded()
  const rows = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } })
  return rows.map(toPublicProduct)
}

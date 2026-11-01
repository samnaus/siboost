import { getSiteContent } from "@/lib/content/get-content"
import { renderLlmsTxt } from "@/lib/llms"
import { getProducts } from "@/lib/products"

export async function GET() {
  const [content, products] = await Promise.all([getSiteContent(), getProducts()])
  return new Response(renderLlmsTxt(content, products), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}

import { connection } from "next/server"
import { ProductEditor } from "@/components/admin-editors"
import { subscriptionsEnabled } from "@/lib/env"
import { getAllProducts } from "@/lib/products"

export const metadata = { title: "Products and prices", robots: { index: false, follow: false } }

export default async function ProductsAdminPage() {
  await connection()
  const products = await getAllProducts()
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Products and prices</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Prices are NZD excluding GST. Checkout reads these records, so a change here is what the next customer is charged. Deactivating a product hides it from the public site.
        {subscriptionsEnabled()
          ? " Monthly subscriptions are currently offered on the public site."
          : " Monthly subscriptions are hidden on the public site until SUBSCRIPTIONS_ENABLED=true."}
      </p>
      <div className="mt-6 grid gap-4">
        {products.map((product) => (
          <ProductEditor
            key={product.key}
            product={product}
            publiclyHidden={!subscriptionsEnabled() && product.kind === "subscription"}
          />
        ))}
      </div>
    </div>
  )
}

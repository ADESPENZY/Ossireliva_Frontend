import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getProducts } from "@/services/apiProduct"
import { AdminProductCard } from "@/components/admin/AdminProductCard"
import { ProductModal } from "@/components/admin/ProductModal"
import type { Product } from "@/types/product"
import { getMe } from "@/services/apiAuth"

export const AdminProductsPage = () => {
  const { data = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: getMe }) // Get role
  const isStaffOnly = user?.role === "staff"

  if (isLoading) return <p>Loading…</p>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold">Products</h2>
          <p className="text-white/60">Manage products and variants</p>
        </div>

        {/* 🔥 Only show if NOT staff-only */}
        {!isStaffOnly && (
          <button
            onClick={() => {
              setEditingProduct(undefined)
              setOpen(true)
            }}
            className="px-4 py-2 bg-brand text-black rounded"
          >
            + Add Product
          </button>
        )}
      </div>
      <div className="space-y-6">
        {data.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onEdit={() => {
              setEditingProduct(product) // 🔥 edit mode
              setOpen(true)
            }}
          />
        ))}
      </div>

      {open && (
        <ProductModal
          product={editingProduct}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

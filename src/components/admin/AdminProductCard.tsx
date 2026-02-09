import { useState } from "react"
import { AdminVariantCard } from "./AdminVariantCard"
import type { Product } from "@/types/product"
import { VariantModal } from "./VariantModal"
import { getMe } from "@/services/apiAuth"
import { useQuery } from "@tanstack/react-query"

interface Props {
  product: Product
  onEdit: () => void
}

export const AdminProductCard = ({ product, onEdit }: Props) => {
    const { data: user } = useQuery({ queryKey: ["me"], queryFn: getMe })
    const isStaffOnly = user?.role === "staff"
    const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
        <div className="flex justify-between items-start">
            <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-white/60 max-w-xl">
                {product.description}
            </p>
            </div>

            {!isStaffOnly && (
              <button onClick={onEdit} className="text-sm text-brand">
                Edit
              </button>
            )}
        </div>

        {/* Variants */}
        <div className="space-y-4">
            <h4 className="text-white/70 text-sm uppercase tracking-wide">Variants</h4>
            <div className="grid md:grid-cols-2 gap-4">
            {product.variants.map((variant) => (
                <AdminVariantCard key={variant.id} variant={variant} />
            ))}
            </div>

            {!isStaffOnly && (
            <button onClick={() => setOpen(true)} className="text-sm text-brand">
                + Add Variant
            </button>
            )}

            {open && (
                <VariantModal
                    productId={product.id}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    </div>
  )
}

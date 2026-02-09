import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct, updateProduct } from "@/services/apiProduct"
import type { Product } from "@/types/product"

interface Props {
  product?: Product
  onClose: () => void
}

type ProductForm = {
  name: string
  description: string
  is_active: boolean
}

export const ProductModal = ({ product, onClose }: Props) => {
  const isEdit = !!product
  const queryClient = useQueryClient()

  const { register, handleSubmit } = useForm<ProductForm>({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      is_active: product?.is_active ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ProductForm) => {
      if (isEdit && product) {
        // 🔥 UPDATE
        return updateProduct(product.id, data)
      }
      // 🔥 CREATE
      return createProduct(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-2xl font-semibold">
          {isEdit ? "Edit Product" : "Create Product"}
        </h3>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <input
            {...register("name", { required: true })}
            placeholder="Product name"
            className="w-full px-4 py-3 bg-black border border-white/10 rounded"
          />

          <textarea
            {...register("description")}
            placeholder="Product description"
            rows={4}
            className="w-full px-4 py-3 bg-black border border-white/10 rounded resize-none"
          />

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" {...register("is_active")} />
            Active
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="text-white/60">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2 bg-brand text-black rounded"
            >
              {mutation.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

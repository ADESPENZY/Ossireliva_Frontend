import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createVariant, updateVariant } from "@/services/apiVariants"
import type { ProductVariant } from "@/types/product"

interface Props {
  productId: number
  variant?: ProductVariant
  onClose: () => void
}

type VariantForm = {
  name: string
  description: string
  price: number
  stock: number
  is_active: boolean
}

export const VariantModal = ({ productId, variant, onClose }: Props) => {
  const isEdit = !!variant
  const queryClient = useQueryClient()

  const { register, handleSubmit } = useForm<VariantForm>({
    defaultValues: {
      name: variant?.name ?? "",
      description: variant?.description ?? "",
      price: variant?.price ?? 0,
      stock: variant?.stock ?? 0,
      is_active: variant?.is_active ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: VariantForm) => {
      if (isEdit && variant) {
        return updateVariant(variant.id, data)
      }
      return createVariant({
        ...data,
        product: productId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-2xl font-semibold">
          {isEdit ? "Edit Variant" : "Add Variant"}
        </h3>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <input
            {...register("name", { required: true })}
            placeholder="Variant name"
            className="w-full px-4 py-3 bg-black border border-white/10 rounded"
          />

          <textarea
            {...register("description")}
            placeholder="Description"
            rows={3}
            className="w-full px-4 py-3 bg-black border border-white/10 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="Price"
              className="px-4 py-3 bg-black border border-white/10 rounded"
            />
            <input
              type="number"
              {...register("stock")}
              placeholder="Stock"
              className="px-4 py-3 bg-black border border-white/10 rounded"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-white/60">
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

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { deleteVariant } from "@/services/apiVariants"
import { createBenefit, deleteBenefit } from "@/services/apiBenefits"
import { VariantModal } from "./VariantModal"
import type { ProductVariant } from "@/types/product"
import { getMe } from "@/services/apiAuth"

export const AdminVariantCard = ({ variant }: { variant: ProductVariant }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: getMe })
  const isStaffOnly = user?.role === "staff"
  const canDelete = user?.role === "admin" || user?.role === "manager"

  const { register, handleSubmit, reset } = useForm<{ text: string }>()

  const addBenefit = useMutation({
    mutationFn: (data: { text: string }) =>
      createBenefit({ variant: variant.id, text: data.text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      reset()
    },
  })

  const deleteBenefitMutation = useMutation({
    mutationFn: (id: number) => deleteBenefit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const deleteVariantMutation = useMutation({
    mutationFn: () => deleteVariant(variant.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return (
    <>
      <div className="p-4 rounded-xl bg-black border border-white/10 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h5 className="font-medium">{variant.name}</h5>
          <div className="flex gap-3 text-xs">
            {!isStaffOnly && (
              <button onClick={() => setOpen(true)} className="text-brand">
                Edit
              </button>
            )}
            
            {/* 🔥 Only high roles can delete */}
            {canDelete && (
              <button onClick={() => deleteVariantMutation.mutate()} className="text-red-400">
                Delete
              </button>
            )}
          </div>
        </div>

        <p className="text-white/60 text-sm">{variant.description}</p>

        <div className="flex gap-4 text-xs text-white/50">
          <span>${variant.price}</span>
          <span>Stock: {variant.stock}</span>
        </div>

        {/* Benefits */}
        <div className="space-y-1">
          <p className="text-xs text-white/40 uppercase">Benefits</p>

          {variant.benefits.map((b) => (
            <div key={b.id} className="flex justify-between items-center text-xs">
              <span className="text-white/60">• {b.text}</span>
              {/* 🔥 Staff cannot remove benefits */}
              {!isStaffOnly && (
                <button onClick={() => deleteBenefitMutation.mutate(b.id)} className="text-red-400">
                  remove
                </button>
              )}
            </div>
          ))}

          {/* Add benefit */}
          {!isStaffOnly && (
            <form 
              onSubmit={handleSubmit((data) => addBenefit.mutate(data))} 
              className="flex items-center gap-2 pt-4 border-t border-white/5 mt-2"
            >
              <input 
                {...register("text", { required: true })} 
                placeholder="Add benefit…" 
                className="flex-1 bg-black border border-white/10 px-3 py-2 rounded-lg text-xs text-white placeholder:text-white/30 outline-none focus:border-brand/50 transition" 
              />
              <button 
                type="submit" 
                disabled={addBenefit.isPending}
                className="text-xs font-bold text-brand hover:text-brand-soft transition px-2 py-2 disabled:opacity-50"
              >
                {addBenefit.isPending ? "..." : "Add"}
              </button>
            </form>
          )}
        </div>
      </div>

      {open && (
        <VariantModal
          productId={variant.product}
          variant={variant}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

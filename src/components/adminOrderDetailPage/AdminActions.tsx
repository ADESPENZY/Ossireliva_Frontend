import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrderStatus } from "@/services/apiOrder"
import { toast } from "sonner"
import type { AdminOrder } from "@/types/adminOrder"
import { Loader2 } from "lucide-react"

export default function AdminActions({ order }: { order: AdminOrder }) {
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (status: AdminOrder["status"]) => updateOrderStatus(order.id, status),
    onSuccess: () => {
      toast.success("Order updated & Customer notified! 📧")
      qc.invalidateQueries({ queryKey: ["admin-order", String(order.id)] })
      qc.invalidateQueries({ queryKey: ["admin-orders"] })
    },
  })

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div>
        <h2 className="text-white font-medium">Update Status</h2>
        <p className="text-white/40 text-xs mt-1">Changing status to 'Shipped' or 'Delivered' triggers customer emails.</p>
      </div>

      <div className="relative">
        <select
          disabled={mutation.isPending}
          value={order.status}
          onChange={(e) => mutation.mutate(e.target.value as AdminOrder["status"])}
          className="bg-black border border-white/10 px-4 py-2 rounded-lg text-white outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {mutation.isPending && (
          <div className="absolute -right-8 top-1/2 -translate-y-1/2">
             <Loader2 className="w-4 h-4 animate-spin text-brand" />
          </div>
        )}
      </div>
    </div>
  )
}

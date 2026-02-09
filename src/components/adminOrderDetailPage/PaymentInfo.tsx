import type { AdminOrder } from "@/types/adminOrder"

export default function PaymentInfo({ order }: { order: AdminOrder }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2">
      <div className="flex justify-between text-white/60">
        <span>Subtotal</span>
        <span>${order.subtotal}</span>
      </div>

      <div className="flex justify-between text-white/60">
        <span>Shipping</span>
        <span>${order.shipping_cost}</span>
      </div>

      <div className="flex justify-between text-white font-semibold pt-2 border-t border-white/10">
        <span>Total</span>
        <span>${order.total}</span>
      </div>
    </div>
  )
}
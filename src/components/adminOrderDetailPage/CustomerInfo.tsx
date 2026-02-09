import type { AdminOrder } from "@/types/adminOrder"

export default function CustomerInfo({ order }: { order: AdminOrder }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-white font-medium mb-4">Customer</h2>

      <p className="text-white">
        {order.first_name} {order.last_name}
      </p>
      <p className="text-white/60">{order.email}</p>

      <p className="text-white/60 mt-2">
        {order.address}, {order.city}, {order.state}
      </p>
    </div>
  )
}

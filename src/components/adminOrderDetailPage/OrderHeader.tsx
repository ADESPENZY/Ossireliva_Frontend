import type { AdminOrder } from "@/types/adminOrder"

export default function OrderHeader({ order }: { order: AdminOrder }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-white font-semibold">
          {order.order_number}
        </h1>
        <p className="text-white/50 text-sm">
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-sm capitalize
          ${order.status === "paid" && "bg-green-500/20 text-green-400"}
          ${order.status === "pending" && "bg-yellow-500/20 text-yellow-400"}
          ${order.status === "shipped" && "bg-blue-500/20 text-blue-400"}
          ${order.status === "delivered" && "bg-purple-500/20 text-purple-400"}
        `}
      >
        {order.status}
      </span>
    </div>
  )
}
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getAdminOrders } from "@/services/apiOrder"
import type { AdminOrder } from "@/services/apiOrder"

export const AdminRecentOrdersSection = () => {
  const { data, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  })

  const recentOrders = data?.slice(0, 4) ?? []

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <Link
          to="/admin/orders"
          className="text-sm text-brand hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && recentOrders.length === 0 && (
        <p className="text-sm text-white/60">
          No orders yet
        </p>
      )}

      {/* Orders */}
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            to={`/admin/orders/${order.id}`}
            className="flex items-center justify-between text-sm hover:bg-white/5 p-2 rounded-lg transition"
          >
            <div>
              <div className="font-medium">
                {order.email}
              </div>
              <div className="text-white/50">
                #{order.order_number}
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium">
                {order.total}
              </div>
              <div
                className={`text-xs capitalize ${
                  order.status === "paid"
                    ? "text-emerald-400"
                    : order.status === "pending"
                    ? "text-yellow-400"
                    : "text-white/50"
                }`}
              >
                {order.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

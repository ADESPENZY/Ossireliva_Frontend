import type { AdminOrderItem } from "@/types/adminOrder"

export default function ItemsTable({
  items,
}: {
  items: AdminOrderItem[]
}) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-white font-medium mb-4">Items</h2>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-white/80">
            <div>
              <p>{item.product_name}</p>
              <p className="text-sm text-white/50">
                {item.variant_name} × {item.quantity}
              </p>
            </div>

            <p>${item.total_price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

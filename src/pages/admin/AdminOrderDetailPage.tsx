import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getAdminOrderById } from "@/services/apiOrder"
import type { AdminOrder } from "@/types/adminOrder"

import OrderHeader from "@/components/adminOrderDetailPage/OrderHeader"
import CustomerInfo from "@/components/adminOrderDetailPage/CustomerInfo"
import ItemsTable from "@/components/adminOrderDetailPage/ItemsTable"
import PaymentInfo from "@/components/adminOrderDetailPage/PaymentInfo"
import AdminActions from "@/components/adminOrderDetailPage/AdminActions"

export const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading } = useQuery<AdminOrder>({
    queryKey: ["admin-order", id],
    queryFn: () => getAdminOrderById(Number(id)),
    enabled: !!id, // ✅ prevents early fetch
  })

  if (isLoading) return <p className="text-white">Loading order…</p>
  if (!order) return <p className="text-white">Order not found</p>

  return (
    <div className="space-y-8">
      <OrderHeader order={order} />
      <CustomerInfo order={order} />
      <ItemsTable items={order.items} />
      <PaymentInfo order={order} />
      <AdminActions order={order} />
    </div>
  )
}

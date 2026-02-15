import api from "@/api"
export interface AdminOrder {
  id: number
  order_number: string
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  email: string
  total: string
  created_at: string
  first_name: string
  last_name: string
  address: string
}

export interface DashboardStats {
  revenue: number;
  orders_count: number;
  products_count: number;
  customers_count: number;
  sales_history: { month: string; sales: number }[];
}

export const createOrder = async (data: any) => {
  const res = await api.post("/api/checkout/", data)
  return res.data
}

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  const res = await api.get("/api/orders/admin/orders/")
  return res.data
}

export const getAdminOrderById = async (id: number) => {
  const res = await api.get(`/api/orders/admin/orders/${id}/`)
  return res.data
}

export const updateOrderStatus = async (
  id: number,
  status: string
) => {
  const res = await api.patch(
    `/api/orders/admin/orders/${id}/`,
    { status }
  )
  return res.data
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/api/orders/dashboard-stats/");
  return res.data;
};
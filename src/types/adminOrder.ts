export interface AdminOrderItem {
  id: number
  product_name: string
  variant_name: string
  unit_price: string
  quantity: number
  total_price: string
}

export interface AdminOrder {
  id: number
  order_number: string
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  email: string
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  subtotal: string
  shipping_cost: string
  total: string
  created_at: string
  items: AdminOrderItem[]
}

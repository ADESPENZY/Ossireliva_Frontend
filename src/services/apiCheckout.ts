import api from "@/api"

export interface CheckoutItem {
  variant: number
  quantity: number
}

export interface CheckoutPayload {
  email: string
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  country: string
  items: CheckoutItem[]
}

export const createCheckout = async (data: CheckoutPayload) => {
  const res = await api.post("/api/orders/checkout/", data)
  return res.data
}

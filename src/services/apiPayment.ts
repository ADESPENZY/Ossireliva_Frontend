import api from "@/api"

export async function createPaymentCheckout(payload: any) {
  const { data } = await api.post("/api/payments/checkout/", payload)
  return data
}

export async function getPaymentStatus(pi: string) {
  const { data } = await api.get(`/api/payments/status/`, {
    params: { pi },
  })
  return data // { order_number, order_status, payment_status }
}

export async function getAdminPayments() {
  const { data } = await api.get("/api/payments/admin/payments/")
  return data
}
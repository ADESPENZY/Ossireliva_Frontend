import api from "@/api"
import type { ProductVariant } from "@/types/product"

export const createVariant = async (data: Partial<ProductVariant>) => {
  const res = await api.post("/api/variants/", data)
  return res.data
}

export const updateVariant = async (
  id: number,
  data: Partial<ProductVariant>
) => {
  const res = await api.patch(`/api/variants/${id}/`, data)
  return res.data
}

export const deleteVariant = async (id: number) => {
  const res = await api.delete(`/api/variants/${id}/`)
  return res.data
}

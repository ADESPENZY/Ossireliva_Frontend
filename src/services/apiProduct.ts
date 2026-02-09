import api from "@/api"
import type { Product } from "@/types/product"

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/api/products/")
  return res.data
}

export const getPublicProduct = async (): Promise<Product> => {
  const res = await api.get("/api/public-products/")

  if (!res.data.length) {
    throw new Error("No public products found")
  }

  return res.data[0]
}

export const updateProduct = async (
  id: number,
  data: Partial<Product>
) => {
  const res = await api.put(`/api/products/${id}/`, data)
  return res.data
}

export const createProduct = async (data: Partial<Product>) => {
  const res = await api.post("/api/products/", data)
  return res.data
}
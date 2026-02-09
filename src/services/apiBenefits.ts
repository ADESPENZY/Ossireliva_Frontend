import api from "@/api"

export const createBenefit = async (data: {
  variant: number
  text: string
}) => {
  const res = await api.post("/api/benefits/", data)
  return res.data
}

export const deleteBenefit = async (id: number) => {
  await api.delete(`/api/benefits/${id}/`)
}
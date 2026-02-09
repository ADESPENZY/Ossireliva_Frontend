import api from "@/api"

interface LoginData {
  username: string
  password: string
}

export async function login(data: LoginData) {
  const response = await api.post("/api/auth/login/", data)
  return response.data
}

export async function logout() {
  const response = await api.post("/api/auth/logout/")
  return response.data
}

export async function getMe() {
  const response = await api.get("/api/auth/me/")
  return response.data
}
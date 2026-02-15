import api from "@/api"

export interface TeamMember {
  id: number
  username: string
  email: string
  role: "admin" | "manager" | "staff"
}

// 1. Get all team members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const res = await api.get("/api/auth/team/")
  return res.data
}

// 2. Create a new member
export const createTeamMember = async (data: any) => {
  const res = await api.post("/api/auth/team/", data)
  return res.data
}

// 3. Reset a member's password (IAM Style)
export const resetMemberPassword = async (id: number, password: any) => {
  const res = await api.post(`/api/auth/team/${id}/change_password/`, { password })
  return res.data
}

// 4. Owner changing their own password
export const updateOwnPassword = async (data: any) => {
  const res = await api.post("/api/auth/me/", data); 
  return res.data;
};

export const deleteTeamMember = async (id: number) => {
  await api.delete(`/api/auth/team/${id}/`)
}

export const updateTeamMember = async (id: number, data: any) => {
  const res = await api.patch(`/api/auth/team/${id}/`, data)
  return res.data
}
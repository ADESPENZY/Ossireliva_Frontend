import axios from "axios"

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  baseURL: "https://ossireliva-ecommerce.onrender.com",
  withCredentials: true, // CRITICAL: Allows cookies to be sent with requests
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is not 401, just reject
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // If already retried, reject and clear auth
    if (originalRequest._retry) {
      clearAuthData()
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err))
    }

    // Mark that we're attempting a retry
    originalRequest._retry = true
    isRefreshing = true

    try {
      // Attempt to refresh the token using cookie
      await api.post("/api/auth/token/refresh/", {}, { 
        withCredentials: true 
      })

      // If refresh succeeded, process queued requests
      processQueue()
      isRefreshing = false

      // Retry the original request
      return api(originalRequest)
    } catch (refreshError) {
        processQueue(refreshError)
        isRefreshing = false
        clearAuthData()

        // Redirect to login
        if (window.location.pathname !== "/login") {
            window.location.href = "/login"
        }

        // 🔥 ADD THIS: Ensure the original query (getMe) knows it failed!
        return Promise.reject(refreshError)
      }
  }
)

// Clear auth data helper
export const clearAuthData = () => {

  localStorage.removeItem("user")

}

export default api
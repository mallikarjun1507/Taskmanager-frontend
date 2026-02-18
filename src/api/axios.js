import axios from "axios"

const API = axios.create({
  baseURL: "https://taskmanager-backend-u0mq.onrender.com/api/",
  withCredentials: true
})

let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

// =========================
// Attach Access Token
// =========================
API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// =========================
// Handle 401 + Refresh Logic
// =========================
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If no response or no config → reject
    if (!error.response || !originalRequest) {
      return Promise.reject(error)
    }

    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh")

    //  Do NOT refresh for auth routes
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true

      try {
        const res = await axios.post(
          "https://taskmanager-backend-u0mq.onrender.com/api/auth/refresh",
          {},
          { withCredentials: true }
        )

        const newAccessToken = res.data.accessToken

        setAccessToken(newAccessToken)

        // Attach new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return API(originalRequest)
      } catch (refreshError) {
        // Refresh failed → clear token & redirect
        setAccessToken(null)
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API

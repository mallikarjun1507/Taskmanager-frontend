import axios from "axios"

/* =========================
   CREATE AXIOS INSTANCE
========================= */
const API = axios.create({
  baseURL: "https://taskmanager-backend-u0mq.onrender.com/api/"
})

/* =========================
   TOKEN STORAGE
========================= */
let accessToken = localStorage.getItem("accessToken") || null

export const setAccessToken = (token) => {
  accessToken = token

  if (token) {
    localStorage.setItem("accessToken", token)
  } else {
    localStorage.removeItem("accessToken")
  }
}

/* =========================
   ATTACH ACCESS TOKEN
========================= */
API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

/* =========================
   HANDLE 401 + AUTO REFRESH
========================= */
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

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          throw new Error("No refresh token")
        }

        // 🔥 Send refreshToken in body
        const res = await axios.post(
          "https://taskmanager-backend-u0mq.onrender.com/api/auth/refresh",
          { refreshToken }
        )

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        } = res.data

        // Save new tokens
        setAccessToken(newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return API(originalRequest)

      } catch (refreshError) {
        // If refresh fails → clear everything
        setAccessToken(null)
        localStorage.removeItem("refreshToken")

        window.location.href = "/login"

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API

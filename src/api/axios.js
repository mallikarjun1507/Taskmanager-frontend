import axios from "axios"

const API = axios.create({
  baseURL: "https://taskmanager-backend-u0mq.onrender.com/api/"
})

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
   REQUEST INTERCEPTOR
========================= */
API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

/* =========================
   RESPONSE INTERCEPTOR
========================= */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || !originalRequest) {
      return Promise.reject(error)
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) throw new Error("No refresh token")

        const res = await axios.post(
          "https://taskmanager-backend-u0mq.onrender.com/api/auth/refresh",
          { refreshToken }
        )

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        } = res.data

        setAccessToken(newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return API(originalRequest)

      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setAccessToken(null)

        window.location.href = "/login"

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API

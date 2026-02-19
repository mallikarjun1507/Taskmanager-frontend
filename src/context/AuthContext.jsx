import { createContext, useEffect, useState } from "react"
import API, { setAccessToken } from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  /* =========================
     REGISTER
  ========================= */
  const register = async (name, email, password) => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed"
      }
    }
  }

  /* =========================
     LOGIN
  ========================= */
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      })

      const { accessToken, refreshToken, user } = res.data

      // Store tokens in localStorage
      setAccessToken(accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      setUser(user)

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password"
      }
    }
  }

  /* =========================
     LOGOUT
  ========================= */
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")

      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken })
      }
    } catch (error) {
      console.log("Logout error:", error)
    } finally {
      // Clear everything
      localStorage.removeItem("refreshToken")
      setAccessToken(null)
      setUser(null)
    }
  }

  /* =========================
     AUTO REFRESH ON APP LOAD
  ========================= */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          setLoading(false)
          return
        }

        const res = await API.post("/auth/refresh", {
          refreshToken
        })

        const {
          accessToken,
          refreshToken: newRefreshToken,
          user
        } = res.data

        // Save new rotated tokens
        setAccessToken(accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        setUser(user)
      } catch (error) {
        // If refresh fails → clear everything
        localStorage.removeItem("refreshToken")
        setAccessToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  /* =========================
     ROLE HELPERS
  ========================= */
  const isAdmin = user?.role === "ADMIN"
  const isManager = user?.role === "MANAGER"
  const isUser = user?.role === "USER"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAdmin,
        isManager,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

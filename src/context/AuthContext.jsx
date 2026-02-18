import { createContext, useEffect, useState } from "react"
import API, { setAccessToken } from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // =========================
  // REGISTER
  // =========================
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

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      })

      setAccessToken(res.data.accessToken)
      setUser(res.data.user)
      return {
        success: true,
        user: res.data.user
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password"
      }
    }
  }

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await API.post("/auth/logout")
    } catch (error) {
      console.log("Logout error:", error)
    } finally {
      setUser(null)
      setAccessToken(null)
    }
  }


 
  // =========================
  // AUTO REFRESH ON APP LOAD
  // =========================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await API.post("/auth/refresh")
        console.log(res, "res")
        console.log(res.data,"res.data")
        setAccessToken(res.data.accessToken)

        // 🔥 FIX: use user from refresh directly
        setUser(res.data.user)
              console.log(user,"userfrom auth")

      } catch {
        setUser(null)
        setAccessToken(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // =========================
  // ROLE HELPERS
  // =========================
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

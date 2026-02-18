import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"
import ManagerPanel from "./pages/ManagerPanel"
import Unauthorized from "./pages/Unauthorized"



import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* MANAGER Route */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <ManagerPanel />
              </ProtectedRoute>
            }
          />

          {/* ADMIN Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

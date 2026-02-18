import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  if (!user) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-md">

      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Left */}
        <h1
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Task Manager
        </h1>

        {/* Right */}
        <div className="flex items-center gap-6">

          <div className="text-sm text-gray-600">
            <span className="font-medium">{user?.name}</span>
            <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
              {user?.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition duration-300"
          >
            Logout
          </button>
        </div>

      </div>

    </div>
  )
}

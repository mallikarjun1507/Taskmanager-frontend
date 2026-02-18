import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    //  Basic validation
    if (!form.email || !form.password) {
      setError("All fields are required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)

    const result = await login(form.email, form.password)

    if (!result.success) {
      setError(result.message)
      setLoading(false)
      return
    }

    const role = result.user.role

    if (result.user.role === "ADMIN") {
  navigate("/admin")
} else if (result.user.role === "MANAGER") {
  navigate("/manager")
} else {
  navigate("/dashboard")
}


    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 px-4">
      <div className="w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Task Manager Login
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-2 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          
          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

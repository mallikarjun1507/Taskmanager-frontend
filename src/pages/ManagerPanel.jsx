import { useContext, useEffect, useState } from "react"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function Manager() {
  const { user } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")

  // =========================
  // Fetch Tasks
  // =========================
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks")
      setTasks(res.data.tasks)
    } catch (error) {
      console.error(error)
    }
  }

 
  // Fetch Users (Only USER role)
  
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users")
      setUsers(res.data.filter((u) => u.role === "USER"))
    } catch (error) {
      console.error(error)
    }
  }

 
  // Create Task
 
  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      await API.post("/tasks", {
        title,
        description,
        assignedTo
      })

      setTitle("")
      setDescription("")
      setAssignedTo("")
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }


  // Update Task Status
  
  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status })
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [])

  return (
    <>
      <Navbar />

    <div className="min-h-screen bg-gray-100 pt-24 p-8">


        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </p>
          
        </div>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Tasks</p>
            <h2 className="text-2xl font-bold">{tasks.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold">
              {tasks.filter(t => t.status === "DONE").length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-2xl font-bold">
              {tasks.filter(t => t.status === "IN_PROGRESS").length}
            </h2>
          </div>
        </div>

        {/* Create Task */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-semibold mb-4">
            Create Task
          </h3>

          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-3 border rounded-lg"
            />

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
              className="p-3 border rounded-lg"
            >
              <option value="">Assign User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 border rounded-lg md:col-span-2"
            />

            <button
              type="submit"
              className="bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 md:col-span-2"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">
            All Tasks
          </h3>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="border p-4 rounded-lg mb-4"
              >
                <h4 className="font-semibold text-lg">
                  {task.title}
                </h4>

                <p className="text-sm text-gray-600">
                  {task.description}
                </p>

                <p className="text-sm mt-2">
                  Assigned To: {task.assignedTo?.name}
                </p>

                <div className="mt-3">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}

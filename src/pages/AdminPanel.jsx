import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")

  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editAssignedTo, setEditAssignedTo] = useState("")

  
  // FETCH USERS
 
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users")
      setUsers(res.data)
    } catch (error) {
      console.error("Fetch users error:", error)
    }
  }

  
  // FETCH TASKS
  
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks")
      setTasks(res.data.tasks)
    } catch (error) {
      console.error("Fetch tasks error:", error)
    }
  }

  
  // CREATE TASK
  
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
      console.error("Create task error:", error)
    }
  }

  
  // DELETE TASK
  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return

    try {
      await API.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  
  // START EDIT

  const startEdit = (task) => {
    setEditingTask(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditAssignedTo(task.assignedTo?._id || "")
  }

  
  // UPDATE TASK
  
  const handleUpdate = async (id) => {
    try {
      await API.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        assignedTo: editAssignedTo
      })

      setEditingTask(null)
      fetchTasks()
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 pt-24 p-8">

      <Navbar />

      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h2>

        {/* ================= CREATE TASK ================= */}
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
              {users
                .filter((u) => u.role === "USER")
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
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
              className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 md:col-span-2"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* ================= TASK LIST ================= */}
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
                {editingTask === task._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />

                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />

                    <select
                      value={editAssignedTo}
                      onChange={(e) => setEditAssignedTo(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    >
                      <option value="">Assign User</option>
                      {users
                        .filter((u) => u.role === "USER")
                        .map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name}
                          </option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(task._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-lg">
                      {task.title}
                    </h4>

                    <p className="text-sm text-gray-600">
                      {task.description}
                    </p>

                    <p className="text-sm mt-2">
                      Assigned To: {task.assignedTo?.name || "Unassigned"}
                    </p>

                    <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {task.status}
                    </span>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => startEdit(task)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

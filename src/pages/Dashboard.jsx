import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import API from "../api/axios"
import Navbar from "../components/Navbar"
import { AuthContext } from "../context/AuthContext"


const columns = ["TODO", "IN_PROGRESS", "DONE"]

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [users, setUsers] = useState([])
  const [assignedTo, setAssignedTo] = useState("")

  const isCreator =
    user?.role === "ADMIN" || user?.role === "MANAGER"


  // Fetch Tasks

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks")
      setTasks(res.data.tasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }


  // Fetch Users

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users")
      setUsers(res.data)
    } catch (error) {
      console.error("Error fetching users:", error)
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
      console.error("Create task error:", error)
    }
  }


  // Drag & Drop

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId

    try {
      await API.put(`/tasks/${taskId}`, {
        status: newStatus
      })

      fetchTasks()
    } catch (error) {
      console.error("Update status error:", error)
    }
  }


  // Group tasks by status

  const groupedTasks = columns.reduce((acc, column) => {
    acc[column] = tasks.filter((task) => task.status === column)
    return acc
  }, {})


  // INITIAL LOAD

  useEffect(() => {
    fetchTasks()
    if (isCreator) fetchUsers()
  }, [])


  //  REAL-TIME SOCKET UPDATE

  useEffect(() => {
    const socket = io(
      "https://taskmanager-backend-u0mq.onrender.com",
      {
        transports: ["websocket"], // better for production
      }
    )

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id)
    })

    socket.on("taskUpdated", () => {
      fetchTasks()
    })

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [])




  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 pt-24 p-8">


        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            User Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </p>

        </div>

        {/* =========================
         CREATE TASK FORM
      ========================= */}
        {isCreator && (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Create New Task
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Assign To</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300"
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* =========================
         KANBAN BOARD
      ========================= */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <Droppable key={column} droppableId={column}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded-xl shadow-md p-4 min-h-[400px]"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-center">
                      {column.replace("_", " ")}
                    </h2>

                    {groupedTasks[column]?.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-indigo-50 p-4 rounded-lg mb-3 shadow hover:shadow-lg transition"
                          >
                            <h4 className="font-semibold">
                              {task.title}
                            </h4>

                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>

                            <p className="text-xs mt-2 text-gray-500">
                              Assigned: {task.assignedTo?.name}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

      </div>
    </>
  )
}

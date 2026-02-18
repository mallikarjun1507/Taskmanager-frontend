import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import API from "../api/axios"

export default function KanbanBoard({ tasks, fetchTasks }) {
  const onDragEnd = async (result) => {
    if (!result.destination) return

    await API.put(`/tasks/${result.draggableId}`, {
      status: result.destination.droppableId
    })

    fetchTasks()
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-6">
        {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded-xl w-1/3"
              >
                <h2 className="font-bold mb-4">{status}</h2>

                {tasks
                  .filter((t) => t.status === status)
                  .map((task, index) => (
                    <Draggable
                      draggableId={task._id}
                      index={index}
                      key={task._id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 mb-3 rounded shadow"
                        >
                          <h3 className="font-semibold">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {task.description}
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
  )
}

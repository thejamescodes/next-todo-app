import { ITask } from "@/types/tasks"
import Task from "./Task"

interface TodoListProps {
    tasks: ITask[]
}


const TodoList: React.FC<TodoListProps> = ({ tasks }) => {
  return (
    <div className="overflow-x-auto">
    <table className="table">
      <thead>
        <tr className="flex w-full">
          <th className="flex-1">TASKS</th>
          <th className="flex-1">REMINDER</th>
          <th className="flex ml-auto text-center">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </tbody>
    </table>
  </div>
  
  )
}

export default TodoList
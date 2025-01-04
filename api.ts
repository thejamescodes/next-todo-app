import { ITask } from "./types/tasks";


const baseUrl = 'https://todo-app-api-2qot.onrender.com'; // prod URL
//const baseUrl = 'http://localhost:3001'; // dev URL

// Fetch all todos
export const getAllTodos = async (): Promise<ITask[]> => {
  const res = await fetch(`${baseUrl}/todos`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const todos = await res.json();
  return todos;
};

// Add a new todo
export const addTodo = async (todo: ITask): Promise<ITask> => {
  const res = await fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: todo.text,
      datetime: todo.datetime,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to add task');
  }

  const newTodo = await res.json();
  return newTodo;
};

// Edit an existing todo
export const editTodo = async (todo: ITask): Promise<ITask> => {
  const res = await fetch(`${baseUrl}/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: todo.text,
      datetime: todo.datetime,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to update task');
  }

  const updatedTodo = await res.json();
  return updatedTodo;
};

// Delete a todo by ID
export const deleteTodo = async (id: string): Promise<void> => {
  const res = await fetch(`${baseUrl}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
};

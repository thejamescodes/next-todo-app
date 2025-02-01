import { ITask } from "./types/tasks";


const baseUrl = 'https://todo-app-api-2qot.onrender.com'; 
//const baseUrl = 'http://localhost:3001'; 


export const getAllTodos = async (): Promise<ITask[]> => {
  const res = await fetch(`${baseUrl}/todos`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const todos = await res.json();
  return todos;
};


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


export const deleteTodo = async (id: string): Promise<void> => {
  const res = await fetch(`${baseUrl}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
};

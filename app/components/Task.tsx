"use client";

import React, { useState, useEffect, FormEventHandler } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiInformationLine } from "react-icons/ri";
import Modal from "./Modal";
import { deleteTodo, editTodo } from "@/api";
import { ITask } from "@/types/tasks";

interface TaskProps {
  task: ITask;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    help: false,
  });
  const [taskDetails, setTaskDetails] = useState({
    text: task.text,
    datetime: task.datetime,
  });
  const [assistanceContent, setAssistanceContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const taskDateTime = new Date(task.datetime).getTime();

      if (taskDateTime <= now) {
        showNotification(task.text);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task.datetime, task.text]);

  const showNotification = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification("Task Due!", {
        body: `The task \"${message}\" is overdue.`,
      });
    }
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleEditSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      text: taskDetails.text,
      datetime: taskDetails.datetime,
    });
    setOpenModal((prev) => ({ ...prev, edit: false }));
    router.refresh();
  };

  const handleDeleteTask = async () => {
    await deleteTodo(task.id);
    setOpenModal((prev) => ({ ...prev, delete: false }));
    router.refresh();
  };

  const fetchAssistance = async () => {
    setOpenModal((prev) => ({ ...prev, help: true }));
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        cache: "no-store",
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "user",
              content: `Help me on my todo list if you have an insight about ${task.text}`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setAssistanceContent(data.choices[0]?.message?.content || "");
    } catch (error) {
      console.error("Error fetching assistance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr key={task.id} className="flex">
      <td className="flex-1">{task.text}</td>
      <td className="flex-1">{formatDate(task.datetime)}</td>
      <td className="flex ml-auto gap-5">
        {/* Edit Task */}
        <FiEdit onClick={() => setOpenModal((prev) => ({ ...prev, edit: true }))} cursor="pointer" size={25} />
        <Modal modalOpen={openModal.edit} setModalOpen={() => setOpenModal((prev) => ({ ...prev, edit: false }))}>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Edit Task</h3>
            <input
              type="text"
              value={taskDetails.text}
              onChange={(e) => setTaskDetails((prev) => ({ ...prev, text: e.target.value }))}
              placeholder="Task description"
              className="input input-bordered w-full"
            />
            <input
              type="datetime-local"
              value={taskDetails.datetime}
              onChange={(e) => setTaskDetails((prev) => ({ ...prev, datetime: e.target.value }))}
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary w-full mt-4">Submit</button>
          </form>
        </Modal>

        {/* Delete Task */}
        <FiTrash2 onClick={() => setOpenModal((prev) => ({ ...prev, delete: true }))} cursor="pointer" size={25} />
        <Modal modalOpen={openModal.delete} setModalOpen={() => setOpenModal((prev) => ({ ...prev, delete: false }))}>
          <h3 className="text-lg">Are you sure you want to delete this task?</h3>
          <div className="modal-action">
            <button onClick={handleDeleteTask} className="btn btn-primary">Yes</button>
          </div>
        </Modal>

        {/* Get Assistance */}
        <RiInformationLine onClick={fetchAssistance} cursor="pointer" size={27} />
        <Modal modalOpen={openModal.help} setModalOpen={() => setOpenModal((prev) => ({ ...prev, help: false }))}>
          <h3 className="text-lg font-bold">Help: {task.text}</h3>
          <div className="whitespace-pre-line text-sm mt-4">
            {isLoading ? <div className="spinner"></div> : assistanceContent || "No assistance available."}
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;

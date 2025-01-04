"use client"

import { ITask } from "@/types/tasks";
import React, { FormEventHandler, useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { deleteTodo, editTodo } from "@/api";
import { RiInformationLine } from "react-icons/ri";
import dotenv from 'dotenv';

interface TaskProps {
    task: ITask
}

const Task: React.FC<TaskProps> = ({ task }) => {
    const router = useRouter();
    const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
    const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
    const [taskToEdit, setTasktoEdit] = useState<string>(task.text);
    const [newDateTime, setNewDateTime] = useState<string>(task.datetime); // Add state for new datetime
    const [openModalHelp, setOpenModalHelp] = useState<boolean>(false);
    const [assistanceContent, setAssistanceContent] = useState<string>(""); // State to store fetched assistance content
    const [isLoading, setIsLoading] = useState<boolean>(false);

    dotenv.config();
    const OPENROUTER_API_KEY = "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";

    // Request Notification Permission
    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // Periodically Check Task Time
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now(); // Current timestamp in milliseconds
            const taskDateTime = new Date(task.datetime).getTime(); // Task timestamp in milliseconds

            console.log("task.datetime (raw):", task.datetime);
            console.log("task.timestamp:", taskDateTime, "now.timestamp:", now);

            // Check if the task time has passed
            if (taskDateTime <= now) {
                showNotification(task.text);
                clearInterval(interval); // Stop checking after triggering
            }
        }, 1000); // Check every second for more precise timing

        return () => clearInterval(interval); // Cleanup on unmount
    }, [task.datetime, task.text]);

    // Show Notification
    const showNotification = (message: string) => {
        if (Notification.permission === "granted") {
            new Notification("Task Due!", {
                body: `The task "${message}" is overdue.`,
            });
        }
    };

    const formatDate = (datetime: string) => {
        const date = new Date(datetime);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short', // e.g., "Dec"
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // 12-hour clock
        });
    };

    // Handle form submission for editing
    const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await editTodo({
            id: task.id,
            text: taskToEdit,
            datetime: newDateTime, // Send updated datetime
        });
        setOpenModalEdit(false);
        router.refresh();
    };

    const handleDeleteTask = async (id: string) => {
        await deleteTodo(id);
        setOpenModalDeleted(false);
        router.refresh();
    };

    const getAssistance = async () => {
        
        setOpenModalHelp(true); // Open the help modal
        setIsLoading(true); // Start loading
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "meta-llama/llama-3.2-3b-instruct:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": "Help me on my todo list if you have an insight about " + `${task.text}`
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Extract the content from the response
            const assistanceContent = data.choices[0]?.message?.content || '';
            setAssistanceContent(assistanceContent); // Store the fetched content

        } catch (error) {
            console.error("Error fetching assistance:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <tr key={task.id} className="flex">
            <td className="flex-1">{task.text}</td>
            <td className="flex-1">{formatDate(task.datetime)}</td>
            <td className="flex ml-auto gap-5">
                <FiEdit onClick={() => setOpenModalEdit(true)} cursor="pointer" size={25} />
                <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
                    <form onSubmit={handleSubmitEditTodo} className="flex flex-col gap-4 mr-3">
                        <h3 className="font-bold text-lg">Edit task</h3>
                        <div className="modal-action flex flex-col gap-4">
                            <input
                                onChange={e => setTasktoEdit(e.target.value)}
                                value={taskToEdit}
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full ml-2"
                            />
                            {/* Date-Time Picker for editing */}
                            <input
                                type="datetime-local"
                                value={newDateTime}  // Bind the input to the state
                                onChange={e => setNewDateTime(e.target.value)}  // Update the state when the user changes the date
                                className="input input-bordered w-full mt-2"
                            />
                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary w-full mt-4">Submit</button>
                        </div>
                    </form>
                </Modal>
                <FiTrash2 onClick={() => setOpenModalDeleted(true)} cursor="pointer" size={25} />
                <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
                    <h3 className="text-lg">Are you sure you want to delete this task?</h3>
                    <div className="modal-action">
                        <button onClick={() => handleDeleteTask(task.id)} className="btn">Yes</button>
                    </div>
                </Modal>
                <RiInformationLine onClick={getAssistance} cursor="pointer" size={27} />
                  <Modal modalOpen={openModalHelp} setModalOpen={setOpenModalHelp}>
                    <h3 className="text-lg font-bold">Help: {task.text}</h3>
                    <div className="whitespace-pre-line text-sm mt-4">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner"></div> {/* Loading spinner */}
                            </div>
                        ) : (
                            assistanceContent.split('\n\n').map((line, index) => (
                                <p key={index} className="mb-4">{line}</p>
                            ))
                        )}
                    </div>
                </Modal>
            </td>
        </tr>
    );
};




export default Task;

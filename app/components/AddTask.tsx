"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { addTodo } from "@/api";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const AddTask = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    text: "",
    datetime: new Date(Date.now() + 60000).toISOString().slice(0, 16),
  });

  const handleInputChange = (field: keyof typeof taskDetails, value: string) => {
    setTaskDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addTodo({
      id: uuidv4(),
      text: taskDetails.text,
      datetime: taskDetails.datetime,
    });
    setTaskDetails({ text: "", datetime: new Date(Date.now() + 60000).toISOString().slice(0, 16) });
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary w-full text-xl font-bold flex items-center justify-center gap-2"
      >
        ADD NEW TASK <AiOutlinePlus size={18} />
      </button>
      <Modal modalOpen={isModalOpen} setModalOpen={setIsModalOpen}>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg">Add New Task</h3>
          <input
            type="text"
            placeholder="Task description"
            className="input input-bordered w-full"
            value={taskDetails.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
          />
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            value={taskDetails.datetime}
            onChange={(e) => handleInputChange("datetime", e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full text-xl font-bold">
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;

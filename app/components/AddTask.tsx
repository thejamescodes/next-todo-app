"use client"

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState, useEffect } from "react";
import { addTodo } from "@/api";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

const AddTask = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>('');
  const [selectedDateTime, setSelectedDateTime] = useState<string>(new Date(new Date().getTime() + 1 * 60000).toISOString().slice(0, 16)); 

  useEffect(() => {
    if (modalOpen) {
      const now = new Date();
      const localDateTime = now.toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16);
      setSelectedDateTime(localDateTime);
    }
  }, [modalOpen]);

  const handleSubmitNewtodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addTodo({
        id: uuidv4(),
        text: newTaskValue,
        datetime: selectedDateTime,
    });
    setNewTaskValue("");
    setSelectedDateTime(new Date(new Date().getTime() + 1 * 60000).toISOString().slice(0, 16)); 
    setModalOpen(false);
    router.refresh();
  }

  return (
    <div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary w-full text-1xl font-bold">
            ADD NEW TASK <AiOutlinePlus className="ml-2" size={18} />
        </button>
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <form onSubmit={handleSubmitNewtodo} className="flex flex-col space-y-4 mr-4">
                <h3 className="font-bold text-lg">Add new task</h3>
                <div className="modal-action flex flex-col space-y-4">
                    <input 
                        onChange={e => setNewTaskValue(e.target.value)}
                        value={newTaskValue} 
                        type="text" 
                        placeholder="Type here" 
                        className="input input-bordered w-full ml-2" 
                    />
                 
                    <input
                        type="datetime-local"
                        value={selectedDateTime}
                        onChange={e => setSelectedDateTime(e.target.value)}
                        className="input input-bordered w-full"
                    />
               
                    <button type="submit" className="btn btn-primary w-full text-1xl font-bold">Submit</button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default AddTask;




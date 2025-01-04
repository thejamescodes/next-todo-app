import React from "react"

interface ModalProps {
    modalOpen: boolean;
    setModalOpen: (open : boolean) => boolean | void;
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ( { modalOpen, setModalOpen, children } ) => {
  return (
    <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
    <div className="modal-box relative max-w-full w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3">
        <form method="dialog">
            {/* Close button */}
            <button
                onClick={() => setModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
                ✕
            </button>
        </form>
        {/* Modal content */}
        {children}
    </div>
</div>
  )
}

export default Modal
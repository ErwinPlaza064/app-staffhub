import Modal from "@/Components/Modal";

// Modal for confirming locker release
export default function LiberarModal({ show, onClose, casillero, onConfirm }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
                    <svg
                        className="w-6 h-6 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-white">
                    ¿Liberar Casillero?
                </h3>
                <p className="mb-1 text-sm text-center text-gray-500 dark:text-gray-400">
                    Estás a punto de liberar el casillero{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                        #{casillero?.numero_casillero}
                    </span>
                </p>
                {casillero?.empleado && (
                    <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-400">
                        Asignado a:{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {casillero.empleado.nombre}
                        </span>
                    </p>
                )}
                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                        Sí, Liberar
                    </button>
                </div>
            </div>
        </Modal>
    );
}

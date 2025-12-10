import Modal from "@/Components/Modal";
import Icons from "@/Components/Icons";

// Modal for confirming employee termination (baja)
export default function BajaModal({
    show,
    onClose,
    empleado,
    bajaData,
    setBajaData,
    processing,
    onSubmit,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                        <Icons.Warning className="w-12 h-12 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Dar de Baja a Empleado
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        ¿Estás seguro de dar de baja a{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                            {empleado?.nombre}
                        </span>
                        ?
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha de Baja
                        </label>
                        <input
                            type="date"
                            value={bajaData.fecha_baja}
                            onChange={(e) =>
                                setBajaData("fecha_baja", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Motivo de Baja
                        </label>
                        <textarea
                            value={bajaData.motivo_baja}
                            onChange={(e) =>
                                setBajaData("motivo_baja", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            rows={3}
                            placeholder="Describe el motivo de la baja..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {processing ? "Procesando..." : "Confirmar Baja"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

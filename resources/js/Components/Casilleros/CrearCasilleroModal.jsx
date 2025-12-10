import Modal from "@/Components/Modal";
import Icons from "@/Components/Icons";
import SearchableSelect from "./SearchableSelect";

// Modal for creating new locker
export default function CrearCasilleroModal({
    show,
    onClose,
    empleadosSinCasillero,
    data,
    setData,
    errors,
    processing,
    onSubmit,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Registrar Locker
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <Icons.X />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Número de Locker
                        </label>
                        <input
                            type="text"
                            value={data.numero_casillero}
                            onChange={(e) =>
                                setData("numero_casillero", e.target.value)
                            }
                            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-600 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            placeholder="Ej: 001"
                            required
                            maxLength={3}
                        />
                        {errors.numero_casillero && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.numero_casillero}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tipo
                        </label>
                        <select
                            value={data.tipo}
                            onChange={(e) => setData("tipo", e.target.value)}
                            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-600 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Hombres">Hombres</option>
                            <option value="Mujeres">Mujeres</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Empleado (Opcional)
                        </label>
                        <SearchableSelect
                            value={data.emp_id}
                            onChange={(value) => setData("emp_id", value)}
                            options={empleadosSinCasillero}
                            placeholder="Buscar empleado..."
                            allowEmpty={true}
                            emptyLabel="Sin asignar (Disponible)"
                        />
                        {errors.emp_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.emp_id}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : "Registrar Locker"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

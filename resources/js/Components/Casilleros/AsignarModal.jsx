import Modal from "@/Components/Modal";
import Icons from "@/Components/Icons";
import SearchableSelect from "./SearchableSelect";

// Modal for assigning locker to employee
export default function AsignarModal({
    show,
    onClose,
    casillero,
    empleadosSinCasillero,
    form,
    onSubmit,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Asignar Casillero #{casillero?.numero_casillero}
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
                            Seleccionar Empleado
                        </label>
                        <SearchableSelect
                            value={form.data.emp_id}
                            onChange={(value) => form.setData("emp_id", value)}
                            options={empleadosSinCasillero}
                            placeholder="Buscar empleado..."
                        />
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
                            disabled={form.processing}
                            className="px-4 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
                        >
                            {form.processing ? "Asignando..." : "Asignar"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

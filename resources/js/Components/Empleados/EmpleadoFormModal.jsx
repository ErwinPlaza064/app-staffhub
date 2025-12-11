import Modal from "@/Components/Modal";
import Input from "@/Components/Input";
import Icons from "@/Components/Icons";

// Modal for adding/editing employees
export default function EmpleadoFormModal({
    show,
    onClose,
    empleado,
    areas,
    grupos,
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
                        {empleado ? "Editar Empleado" : "Agregar Empleado"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <Icons.X />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        label="Número de Nómina"
                        name="numero_nomina"
                        type="text"
                        value={data.numero_nomina}
                        onChange={(e) => setData("numero_nomina", e.target.value)}
                        error={errors.numero_nomina}
                        placeholder="Ej: 09014"
                        required
                        maxLength={5}
                    />

                    <Input
                        label="Nombre Completo"
                        name="nombre"
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData("nombre", e.target.value)}
                        error={errors.nombre}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Área
                        </label>
                        <select
                            value={data.area}
                            onChange={(e) => setData("area", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            {areas.map((area) => (
                                <option key={area.Id || area.id} value={area.nombre}>
                                    {area.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Puesto"
                        name="puesto"
                        type="text"
                        value={data.puesto}
                        onChange={(e) => setData("puesto", e.target.value)}
                        error={errors.puesto}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Grupo
                        </label>
                        <select
                            value={data.grupo}
                            onChange={(e) => setData("grupo", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            {grupos.map((grupo) => (
                                <option key={grupo.Id || grupo.id} value={grupo.nombre}>
                                    {grupo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Género
                        </label>
                        <select
                            value={data.genero || "Masculino"}
                            onChange={(e) => setData("genero", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                        {errors.genero && (
                            <p className="mt-1 text-sm text-red-600">{errors.genero}</p>
                        )}
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
                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {processing
                                ? "Guardando..."
                                : empleado
                                ? "Actualizar"
                                : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

import Modal from "@/Components/Modal";
import Input from "@/Components/Input";
import Icons from "@/Components/Icons";

// Config Form Modal for adding/editing areas or grupos
export default function ConfigFormModal({
    show,
    onClose,
    title,
    form,
    onSubmit,
    isEditing,
    activeLabel,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Icons.X />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        label={`Nombre ${activeLabel === 'Área' ? 'del Área' : 'del Grupo'}`}
                        name="nombre"
                        value={form.data.nombre}
                        onChange={(e) => form.setData("nombre", e.target.value)}
                        error={form.errors.nombre}
                        required
                        maxLength={activeLabel === 'Área' ? 50 : 20}
                    />
                    <Input
                        label="Descripción (Opcional)"
                        name="descripcion"
                        value={form.data.descripcion}
                        onChange={(e) => form.setData("descripcion", e.target.value)}
                        error={form.errors.descripcion}
                        maxLength={255}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="config-activo"
                            checked={form.data.activo}
                            onChange={(e) => form.setData("activo", e.target.checked)}
                            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="config-activo" className="text-sm text-gray-700 dark:text-gray-300">
                            {activeLabel} activa
                        </label>
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
                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {form.processing ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

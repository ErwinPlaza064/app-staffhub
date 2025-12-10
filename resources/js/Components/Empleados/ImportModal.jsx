import { useState } from "react";
import Modal from "@/Components/Modal";
import Icons from "@/Components/Icons";
import { router } from "@inertiajs/react";

// Modal for importing employees from Excel
export default function ImportModal({ show, onClose, onImport }) {
    const [importFile, setImportFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onImport(importFile);
    };

    const handleClose = () => {
        setImportFile(null);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Importar Empleados
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl p-8 text-center bg-gray-50 dark:bg-dark-900/50 hover:bg-gray-100 dark:hover:bg-dark-900 transition-colors">
                        <input
                            type="file"
                            id="file-upload"
                            accept=".xlsx,.xls"
                            onChange={(e) => setImportFile(e.target.files[0])}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                        >
                            <Icons.Upload className="w-8 h-8 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {importFile ? importFile.name : "Seleccionar archivo Excel"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Formatos soportados: .xlsx, .xls
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <a
                            href={route('empleados.template')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                            <Icons.Template className="w-4 h-4" />
                            Descargar Plantilla
                        </a>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!importFile}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Importar
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

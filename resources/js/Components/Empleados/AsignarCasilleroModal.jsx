import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import Icons from "@/Components/Icons";
import { router } from "@inertiajs/react";
import { useToast } from "@/Contexts/ToastContext";

export default function AsignarCasilleroModal({
    show,
    onClose,
    empleado,
    onSuccess,
}) {
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [casillerosDisponibles, setCasillerosDisponibles] = useState(null);
    const [tipoCasillero, setTipoCasillero] = useState("");

    // Cargar información de casilleros disponibles cuando se abre el modal
    useEffect(() => {
        if (show && empleado) {
            fetchCasillerosDisponibles();
        }
    }, [show, empleado]);

    const fetchCasillerosDisponibles = async () => {
        if (!empleado) return;

        try {
            const response = await fetch(
                route("empleados.casilleros-disponibles", empleado.Id || empleado.id)
            );
            const data = await response.json();
            setCasillerosDisponibles(data.disponibles);
            setTipoCasillero(data.tipo);
        } catch (error) {
            console.error("Error al obtener casilleros disponibles:", error);
        }
    };

    const handleAsignar = () => {
        if (!empleado) return;

        setLoading(true);
        router.post(
            route("empleados.asignar-casillero", empleado.Id || empleado.id),
            {},
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    setLoading(false);
                    
                    // Mostrar mensaje de éxito desde el backend
                    const successMessage = page.props.flash?.success;
                    if (successMessage) {
                        showSuccess(successMessage);
                    }
                    
                    onClose();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    setLoading(false);
                    
                    // Mostrar error si no hay casilleros disponibles
                    const errorMessage = errors.casillero || "Error al asignar el casillero";
                    showError(errorMessage);
                },
            }
        );
    };

    const handleOmitir = () => {
        onClose();
        if (onSuccess) onSuccess();
    };

    if (!empleado) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <Icons.Box className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Asignar Casillero
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Empleado registrado: <span className="font-medium text-gray-900 dark:text-white">{empleado.nombre}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <Icons.X />
                    </button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Casilleros disponibles tipo <span className="font-medium">{tipoCasillero}</span>
                            </p>
                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {casillerosDisponibles !== null ? casillerosDisponibles : "..."}
                            </p>
                        </div>
                        <Icons.Box className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    ¿Deseas asignar automáticamente un casillero disponible a este empleado?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={handleOmitir}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        Omitir
                    </button>
                    <button
                        onClick={handleAsignar}
                        disabled={loading || casillerosDisponibles === 0}
                        className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Asignando...
                            </>
                        ) : (
                            <>
                                <Icons.Check className="w-5 h-5" />
                                Asignar Automáticamente
                            </>
                        )}
                    </button>
                </div>

                {casillerosDisponibles === 0 && (
                    <p className="mt-4 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                        <Icons.AlertCircle className="w-4 h-4" />
                        No hay casilleros disponibles del tipo {tipoCasillero}
                    </p>
                )}
            </div>
        </Modal>
    );
}

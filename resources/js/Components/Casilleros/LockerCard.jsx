import Icons from "@/Components/Icons";
import StatusBadge from "./StatusBadge";

// Locker Card Component
export default function LockerCard({ casillero, onAsignar, onLiberar }) {
    const statusColors = {
        Disponible:
            "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
        Ocupado: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
        Mantenimiento:
            "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10",
    };

    return (
        <div
            className={`p-4 rounded-xl border transition-all w-full min-h-[140px] flex flex-col ${
                statusColors[casillero.estatus]
            } dark:bg-dark-800/50`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    #{casillero.numero_casillero}
                </span>
                <StatusBadge estatus={casillero.estatus} />
            </div>

            {casillero.empleado ? (
                <div className="mb-3 space-y-1 flex-grow">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <Icons.User />
                        <span className="break-words">
                            {casillero.empleado.nombre}
                        </span>
                    </div>
                    <div className="pl-6 space-y-0.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Nómina:</span>{" "}
                            {casillero.empleado.numero_nomina}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Área:</span>{" "}
                            {casillero.empleado.area}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="mb-3 text-sm text-gray-400 dark:text-gray-500 flex-grow">
                    Sin asignar
                </p>
            )}

            <div className="flex gap-2">
                {casillero.estatus === "Disponible" && (
                    <button
                        onClick={() => onAsignar(casillero)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                        Asignar
                    </button>
                )}
                {casillero.estatus === "Ocupado" && (
                    <button
                        onClick={() => onLiberar(casillero)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Liberar
                    </button>
                )}
            </div>
        </div>
    );
}

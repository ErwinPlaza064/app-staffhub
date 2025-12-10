import { router } from "@inertiajs/react";
import Icons from "@/Components/Icons";
import AreaBadge from "./AreaBadge";

// Complete table component with header, search, filters, and employee list
export default function EmpleadosTable({
    empleados,
    activeFilter,
    searchQuery,
    setSearchQuery,
    onFilterChange,
    onEdit,
    onBaja,
    onOpenImportModal,
    areas,
    tableRef,
}) {
    const areasOptions = ["Todos", ...areas.map((a) => a.nombre)];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("empleados.index"),
            { area: activeFilter, search: searchQuery },
            { preserveState: true }
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        router.get(route("empleados.index"), {
            area: activeFilter,
        });
    };

    return (
        <div
            ref={tableRef}
            className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-xl shadow-gray-200/50 dark:shadow-dark-900/50 overflow-hidden"
        >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                Empleados Registrados
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Exportar Excel */}
                            <a
                                href={route("empleados.export")}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-lg shadow-green-500/30"
                            >
                                <Icons.Download className="w-4 h-4" />
                                <span className="hidden md:inline">Exportar</span>
                            </a>

                            {/* Importar Excel */}
                            <button
                                onClick={onOpenImportModal}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                            >
                                <Icons.Upload className="w-4 h-4" />
                                <span className="hidden md:inline">Importar</span>
                            </button>

                            <button
                                onClick={() => onEdit(null)}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white transition-all rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 shadow-lg shadow-primary-500/30"
                            >
                                <Icons.Plus />
                                <span className="hidden sm:inline">
                                    Agregar Empleado
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icons.Search />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        )}
                    </form>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                        {areasOptions.map((area) => (
                            <button
                                key={area}
                                onClick={() => onFilterChange(area)}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeFilter === area
                                        ? "bg-primary-500 text-white"
                                        : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                                }`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-3 sm:px-0">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-900">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    NN
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Nombre
                                </th>
                                {/* Mostrar Área solo en "Todos" o "Staff" */}
                                {(activeFilter === "Todos" ||
                                    activeFilter === "Staff") && (
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Área
                                    </th>
                                )}
                                {/* Mostrar Puesto solo si NO es "Todos" */}
                                {activeFilter !== "Todos" && (
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                        Puesto
                                    </th>
                                )}
                                {/* Mostrar Grupo solo si NO es "Staff" */}
                                {activeFilter !== "Staff" && (
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                        Grupo
                                    </th>
                                )}
                                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                            {empleados?.length > 0 ? (
                                empleados.map((empleado) => (
                                    <tr
                                        key={empleado.Id || empleado.id}
                                        className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400">
                                            {empleado.numero_nomina}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                                            {empleado.nombre}
                                        </td>
                                        {/* Mostrar Área solo en "Todos" o "Staff" */}
                                        {(activeFilter === "Todos" ||
                                            activeFilter === "Staff") && (
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                <AreaBadge area={empleado.area} />
                                            </td>
                                        )}
                                        {/* Mostrar Puesto solo si NO es "Todos" */}
                                        {activeFilter !== "Todos" && (
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                                {empleado.puesto}
                                            </td>
                                        )}
                                        {/* Mostrar Grupo solo si NO es "Staff" */}
                                        {activeFilter !== "Staff" && (
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                                {empleado.grupo}
                                            </td>
                                        )}
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                <button
                                                    onClick={() => onEdit(empleado)}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-primary-500 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icons.Edit />
                                                </button>
                                                <button
                                                    onClick={() => onBaja(empleado)}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Dar de baja"
                                                >
                                                    <Icons.UserX />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        No hay empleados registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-dark-700">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {empleados?.length || 0} empleados
                </p>
            </div>
        </div>
    );
}

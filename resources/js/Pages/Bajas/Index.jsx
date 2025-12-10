import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Icons from "@/Components/Icons";
import StatCard from "@/Components/Empleados/StatCard";
import AreaBadge from "@/Components/Empleados/AreaBadge";

export default function BajasIndex({ bajas, contadores, filtros }) {
    const [searchQuery, setSearchQuery] = useState(filtros?.search || "");

    const handleReactivar = (empleado) => {
        const empleadoId = empleado.Id || empleado.id;
        router.post(
            route("empleados.reactivar", empleadoId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route("bajas.index"), {
                        preserveState: false,
                        preserveScroll: true,
                    });
                },
            }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("bajas.index"),
            { search: searchQuery },
            { preserveState: true }
        );
    };

    const goBack = () => {
        router.visit(route("empleados.index"));
    };

    return (
        <AppLayout>
            <Head title="Bajas de Empleados - StaffHub" />

            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm hover:shadow-md transition-all"
                >
                    <Icons.ArrowLeft />
                    <span>Volver a Empleados</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Empleados Dados de Baja
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Historial de bajas del personal
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatCard
                    title="Total Bajas"
                    value={contadores?.total || 0}
                    icon={Icons.UserMinus}
                    color="primary"
                    gradient="from-red-500 to-rose-500"
                />
                <StatCard
                    title="Staff"
                    value={contadores?.staff || 0}
                    icon={Icons.Staff}
                    gradient="from-indigo-500 to-purple-500"
                />
                <StatCard
                    title="Calidad"
                    value={contadores?.calidad || 0}
                    icon={Icons.Clipboard}
                    gradient="from-emerald-500 to-teal-500"
                />
                <StatCard
                    title="Producción"
                    value={contadores?.produccion || 0}
                    icon={Icons.Factory}
                    gradient="from-blue-500 to-indigo-500"
                />
                <StatCard
                    title="Almacén"
                    value={contadores?.almacen || 0}
                    icon={Icons.Box}
                    gradient="from-amber-500 to-orange-500"
                />
                <StatCard
                    title="Mantenimiento"
                    value={contadores?.mantenimiento || 0}
                    icon={Icons.Wrench}
                    gradient="from-purple-500 to-pink-500"
                />
            </div>

            {/* Bajas Table Card */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-xl shadow-gray-200/50 dark:shadow-dark-900/50 overflow-hidden">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-dark-700">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                Registro de Bajas
                            </h2>
                        </div>

                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full"
                        >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre, número de nómina, área o motivo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                            />
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    No. Nómina
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Área
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Puesto
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Grupo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Fecha de Baja
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Motivo de Baja
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                            {bajas?.length > 0 ? (
                                bajas.map((empleado) => (
                                    <tr
                                        key={empleado.Id || empleado.id}
                                        className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
                                    >
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                                            {empleado.numero_nomina}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {empleado.nombre}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <AreaBadge area={empleado.area} />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {empleado.puesto}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {empleado.grupo}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Icons.Calendar className="w-4 h-4 text-red-400" />
                                                {empleado.fecha_baja
                                                    ? new Date(
                                                          empleado.fecha_baja
                                                      ).toLocaleDateString(
                                                          "es-MX",
                                                          {
                                                              year: "numeric",
                                                              month: "long",
                                                              day: "numeric",
                                                          }
                                                      )
                                                    : "-"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                                            <div
                                                className="truncate"
                                                title={empleado.motivo_baja}
                                            >
                                                {empleado.motivo_baja || "-"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() =>
                                                    handleReactivar(empleado)
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                title="Reactivar empleado"
                                            >
                                                <Icons.Refresh />
                                                Reactivar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Icons.UserMinus className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p>
                                                No hay empleados dados de baja
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-dark-700">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {bajas?.length || 0} empleados dados de baja
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

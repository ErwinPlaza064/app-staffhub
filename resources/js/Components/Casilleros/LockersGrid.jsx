import Icons from "@/Components/Icons";
import LockerCard from "./LockerCard";

// Lockers Grid Component showing both male and female sections
export default function LockersGrid({
    casillerosHombres,
    casillerosMujeres,
    contadores,
    onAsignar,
    onLiberar,
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Hombres Section */}
            <div className="overflow-hidden bg-white border border-gray-200 dark:bg-dark-800 rounded-xl dark:border-dark-700">
                <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-blue-500/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 text-blue-500 rounded-lg bg-blue-500/20">
                                <Icons.Male />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Lockers Hombres
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {contadores?.hombres?.ocupados || 0}/
                                    {contadores?.hombres?.total || 0} ocupados
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
                    {casillerosHombres?.length > 0 ? (
                        casillerosHombres.map((casillero) => (
                            <LockerCard
                                key={casillero.Id || casillero.id}
                                casillero={casillero}
                                onAsignar={onAsignar}
                                onLiberar={onLiberar}
                            />
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-500 col-span-full dark:text-gray-400">
                            No hay casilleros registrados
                        </div>
                    )}
                </div>
            </div>

            {/* Mujeres Section */}
            <div className="overflow-hidden bg-white border border-gray-200 dark:bg-dark-800 rounded-xl dark:border-dark-700">
                <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-pink-500/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 text-pink-500 rounded-lg bg-pink-500/20">
                                <Icons.Female />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Lockers Mujeres
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {contadores?.mujeres?.ocupados || 0}/
                                    {contadores?.mujeres?.total || 0} ocupados
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
                    {casillerosMujeres?.length > 0 ? (
                        casillerosMujeres.map((casillero) => (
                            <LockerCard
                                key={casillero.Id || casillero.id}
                                casillero={casillero}
                                onAsignar={onAsignar}
                                onLiberar={onLiberar}
                            />
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-500 col-span-full dark:text-gray-400">
                            No hay casilleros registrados
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

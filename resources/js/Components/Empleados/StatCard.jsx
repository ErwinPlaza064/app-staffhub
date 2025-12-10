// Stat Card Component for displaying statistics with icons and gradients
export default function StatCard({
    title,
    value,
    icon: Icon,
    color = "primary",
    gradient = "from-cyan-500 to-blue-500",
    onClick,
    active,
}) {
    const colors = {
        primary: "from-cyan-500 to-blue-500",
        staff: "from-indigo-500 to-purple-500",
        calidad: "from-emerald-500 to-teal-500",
        produccion: "from-blue-500 to-indigo-500",
        almacen: "from-amber-500 to-orange-500",
        mantenimiento: "from-purple-500 to-pink-500",
        bajas: "from-red-500 to-rose-500",
    };

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white dark:bg-dark-800 rounded-2xl p-5 border shadow-lg shadow-gray-200/50 dark:shadow-dark-900/50 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-dark-900/70 hover:-translate-y-1 transition-all duration-300 ${
                onClick ? "cursor-pointer" : ""
            } ${
                active
                    ? "border-primary-500 ring-2 ring-primary-500/30"
                    : "border-gray-200 dark:border-dark-700"
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-dark-700/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
                <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                        colors[color] || gradient
                    } shadow-lg mb-4`}
                >
                    <Icon className="text-white" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    {title}
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}

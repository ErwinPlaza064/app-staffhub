// Area Badge Component for displaying area tags with specific colors
export default function AreaBadge({ area }) {
    const colors = {
        Staff: "bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20",
        Calidad:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        Producción:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        Almacén:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        Mantenimiento:
            "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                colors[area] ||
                "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
            }`}
        >
            {area}
        </span>
    );
}

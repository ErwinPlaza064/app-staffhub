// Status Badge Component for locker status
export default function StatusBadge({ estatus }) {
    const colors = {
        Disponible:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        Ocupado:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        Mantenimiento:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };

    return (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                colors[estatus] || "bg-gray-500/10 text-gray-600"
            }`}
        >
            {estatus}
        </span>
    );
}

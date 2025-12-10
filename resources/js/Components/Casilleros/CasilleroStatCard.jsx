import Icons from "@/Components/Icons";

// Stat Card Component for locker statistics
export default function CasilleroStatCard({ title, value, subtitle, color = "primary" }) {
    const colors = {
        primary: "bg-primary-500/10 text-primary-500",
        blue: "bg-blue-500/10 text-blue-500",
        pink: "bg-pink-500/10 text-pink-500",
    };

    return (
        <div className="p-4 bg-white border border-gray-200 dark:bg-dark-800 rounded-xl dark:border-dark-700">
            <div className={`inline-flex p-3 rounded-xl ${colors[color]}`}>
                <Icons.Locker />
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
            </p>
            {subtitle && (
                <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
            )}
        </div>
    );
}

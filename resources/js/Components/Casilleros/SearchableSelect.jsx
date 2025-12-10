import { useState, useRef, useEffect } from "react";

// Searchable Select Component for employee selection
export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Buscar empleado...",
    allowEmpty = false,
    emptyLabel = "Sin asignar",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);

    const selectedOption = options?.find((opt) => (opt.Id || opt.id) == value);

    const filteredOptions =
        options?.filter((opt) => {
            const searchLower = search.toLowerCase();
            return (
                opt.nombre?.toLowerCase().includes(searchLower) ||
                opt.numero_nomina?.toString().includes(searchLower) ||
                opt.area?.toLowerCase().includes(searchLower)
            );
        }) || [];

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (empleado) => {
        onChange(empleado ? empleado.Id || empleado.id : "");
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer dark:border-dark-600 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
                {selectedOption ? (
                    <span>
                        {selectedOption.nombre} - {selectedOption.area}
                    </span>
                ) : (
                    <span className="text-gray-400">
                        {allowEmpty ? emptyLabel : placeholder}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-dark-800 dark:border-dark-600 max-h-64">
                    <div className="p-2 border-b border-gray-200 dark:border-dark-600">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, nómina o área..."
                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:border-dark-600 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="overflow-y-auto max-h-48">
                        {allowEmpty && (
                            <div
                                onClick={() => handleSelect(null)}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700 text-sm ${
                                    !value
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                        : "text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                {emptyLabel}
                            </div>
                        )}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((empleado) => (
                                <div
                                    key={empleado.Id || empleado.id}
                                    onClick={() => handleSelect(empleado)}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700 text-sm ${
                                        (empleado.Id || empleado.id) == value
                                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    <div className="font-medium">
                                        {empleado.nombre}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        #{empleado.numero_nomina} ·{" "}
                                        {empleado.area}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                                No se encontraron empleados
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

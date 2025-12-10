import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Icons from "@/Components/Icons";

// Sortable Item Component for drag and drop
export default function SortableItem({ item, onEdit, onDelete, type }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.Id || item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-4 border border-gray-200 dark:border-dark-700 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors ${
                isDragging ? "shadow-lg z-50" : ""
            }`}
        >
            <div className="flex items-center gap-3 flex-1">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <Icons.DragHandle />
                </button>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.nombre}
                    </h3>
                    {item.descripcion && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.descripcion}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${item.activo ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                </span>
                <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                >
                    <Icons.Edit />
                </button>
                <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Icons.Trash />
                </button>
            </div>
        </div>
    );
}

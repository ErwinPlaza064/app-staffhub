import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Icons from "@/Components/Icons";
import SortableItem from "./SortableItem";

// Sortable Section Component for areas or grupos
export default function SortableSection({
    title,
    items,
    sensors,
    onDragEnd,
    onAdd,
    onEdit,
    onDelete,
    type,
}) {
    return (
        <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-xl shadow-gray-200/50 dark:shadow-dark-900/50">
            <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 shadow-lg shadow-primary-500/30"
                    >
                        <Icons.Plus />
                        Agregar {title.slice(0, -1)}
                    </button>
                </div>
            </div>
            <div className="p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={items.map(item => item.Id || item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {items?.length > 0 ? (
                                items.map((item) => (
                                    <SortableItem
                                        key={item.Id || item.id}
                                        item={item}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        type={type}
                                    />
                                ))
                            ) : (
                                <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    No hay {title.toLowerCase()} registradas
                                </p>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}

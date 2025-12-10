import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useToast } from "@/Contexts/ToastContext";
import ConfirmModal from "@/Components/ConfirmModal";
import Icons from "@/Components/Icons";
import SortableSection from "@/Components/Configuracion/SortableSection";
import ConfigFormModal from "@/Components/Configuracion/ConfigFormModal";
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export default function ConfiguracionIndex({ areas: initialAreas, grupos: initialGrupos }) {
    const { showSuccess, showError } = useToast();
    
    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Local state for drag and drop
    const [areas, setAreas] = useState(initialAreas || []);
    const [grupos, setGrupos] = useState(initialGrupos || []);
    
    // Areas state
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [areaToDelete, setAreaToDelete] = useState(null);
    const [showDeleteAreaModal, setShowDeleteAreaModal] = useState(false);
    
    // Grupos state
    const [showGrupoModal, setShowGrupoModal] = useState(false);
    const [editingGrupo, setEditingGrupo] = useState(null);
    const [grupoToDelete, setGrupoToDelete] = useState(null);
    const [showDeleteGrupoModal, setShowDeleteGrupoModal] = useState(false);

    // Area form
    const areaForm = useForm({
        nombre: "",
        descripcion: "",
        activo: true,
    });

    // Grupo form
    const grupoForm = useForm({
        nombre: "",
        descripcion: "",
        activo: true,
    });

    // Drag handlers for areas
    const handleAreaDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setAreas((items) => {
                const oldIndex = items.findIndex((item) => (item.Id || item.id) === active.id);
                const newIndex = items.findIndex((item) => (item.Id || item.id) === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Update orden field
                const areasToUpdate = newItems.map((item, index) => ({
                    id: item.Id || item.id,
                    orden: index + 1,
                }));
                
                // Save to backend
                router.post(route('configuracion.areas.reorder'), { areas: areasToUpdate }, {
                    preserveScroll: true,
                    onSuccess: () => showSuccess('Orden de áreas actualizado'),
                    onError: () => showError('Error al actualizar el orden'),
                });
                
                return newItems;
            });
        }
    };

    // Drag handlers for grupos
    const handleGrupoDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setGrupos((items) => {
                const oldIndex = items.findIndex((item) => (item.Id || item.id) === active.id);
                const newIndex = items.findIndex((item) => (item.Id || item.id) === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Update orden field
                const gruposToUpdate = newItems.map((item, index) => ({
                    id: item.Id || item.id,
                    orden: index + 1,
                }));
                
                // Save to backend
                router.post(route('configuracion.grupos.reorder'), { grupos: gruposToUpdate }, {
                    preserveScroll: true,
                    onSuccess: () => showSuccess('Orden de grupos actualizado'),
                    onError: () => showError('Error al actualizar el orden'),
                });
                
                return newItems;
            });
        }
    };

    // Area handlers
    const openAreaModal = (area = null) => {
        if (area) {
            setEditingArea(area);
            areaForm.setData({
                nombre: area.nombre,
                descripcion: area.descripcion || "",
                activo: area.activo,
            });
        } else {
            setEditingArea(null);
            areaForm.reset();
        }
        setShowAreaModal(true);
    };

    const closeAreaModal = () => {
        setShowAreaModal(false);
        setEditingArea(null);
        areaForm.reset();
    };

    const handleAreaSubmit = (e) => {
        e.preventDefault();
        
        if (editingArea) {
            areaForm.put(route("configuracion.areas.update", editingArea.Id || editingArea.id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeAreaModal();
                    showSuccess("Área actualizada exitosamente");
                },
                onError: () => {
                    showError("Error al actualizar el área");
                },
            });
        } else {
            areaForm.post(route("configuracion.areas.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    closeAreaModal();
                    showSuccess("Área agregada exitosamente");
                },
                onError: () => {
                    showError("Error al agregar el área");
                },
            });
        }
    };

    const openDeleteAreaModal = (area) => {
        setAreaToDelete(area);
        setShowDeleteAreaModal(true);
    };

    const handleDeleteArea = () => {
        router.delete(route("configuracion.areas.destroy", areaToDelete.Id || areaToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteAreaModal(false);
                setAreaToDelete(null);
                showSuccess("Área eliminada exitosamente");
            },
            onError: (errors) => {
                showError(errors.area || "Error al eliminar el área");
            },
        });
    };

    // Grupo handlers
    const openGrupoModal = (grupo = null) => {
        if (grupo) {
            setEditingGrupo(grupo);
            grupoForm.setData({
                nombre: grupo.nombre,
                descripcion: grupo.descripcion || "",
                activo: grupo.activo,
            });
        } else {
            setEditingGrupo(null);
            grupoForm.reset();
        }
        setShowGrupoModal(true);
    };

    const closeGrupoModal = () => {
        setShowGrupoModal(false);
        setEditingGrupo(null);
        grupoForm.reset();
    };

    const handleGrupoSubmit = (e) => {
        e.preventDefault();
        
        if (editingGrupo) {
            grupoForm.put(route("configuracion.grupos.update", editingGrupo.Id || editingGrupo.id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeGrupoModal();
                    showSuccess("Grupo actualizado exitosamente");
                },
                onError: () => {
                    showError("Error al actualizar el grupo");
                },
            });
        } else {
            grupoForm.post(route("configuracion.grupos.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    closeGrupoModal();
                    showSuccess("Grupo agregado exitosamente");
                },
                onError: () => {
                    showError("Error al agregar el grupo");
                },
            });
        }
    };

    const openDeleteGrupoModal = (grupo) => {
        setGrupoToDelete(grupo);
        setShowDeleteGrupoModal(true);
    };

    const handleDeleteGrupo = () => {
        router.delete(route("configuracion.grupos.destroy", grupoToDelete.Id || grupoToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteGrupoModal(false);
                setGrupoToDelete(null);
                showSuccess("Grupo eliminado exitosamente");
            },
            onError: (errors) => {
                showError(errors.grupo || "Error al eliminar el grupo");
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Configuración - StaffHub" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary-500/10 rounded-xl">
                        <Icons.Settings className="w-8 h-8 text-primary-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Configuración
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Gestiona áreas y grupos - Arrastra para reordenar
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Áreas Section */}
                <SortableSection
                    title="Áreas"
                    items={areas}
                    sensors={sensors}
                    onDragEnd={handleAreaDragEnd}
                    onAdd={() => openAreaModal()}
                    onEdit={openAreaModal}
                    onDelete={openDeleteAreaModal}
                    type="area"
                />

                {/* Grupos Section */}
                <SortableSection
                    title="Grupos"
                    items={grupos}
                    sensors={sensors}
                    onDragEnd={handleGrupoDragEnd}
                    onAdd={() => openGrupoModal()}
                    onEdit={openGrupoModal}
                    onDelete={openDeleteGrupoModal}
                    type="grupo"
                />
            </div>

            {/* Area Modal */}
            <ConfigFormModal
                show={showAreaModal}
                onClose={closeAreaModal}
                title={editingArea ? "Editar Área" : "Agregar Área"}
                form={areaForm}
                onSubmit={handleAreaSubmit}
                isEditing={!!editingArea}
                activeLabel="Área"
            />

            {/* Grupo Modal */}
            <ConfigFormModal
                show={showGrupoModal}
                onClose={closeGrupoModal}
                title={editingGrupo ? "Editar Grupo" : "Agregar Grupo"}
                form={grupoForm}
                onSubmit={handleGrupoSubmit}
                isEditing={!!editingGrupo}
                activeLabel="Grupo"
            />

            {/* Delete Area Confirm Modal */}
            <ConfirmModal
                show={showDeleteAreaModal}
                title="Eliminar Área"
                message={`¿Estás seguro de eliminar el área "${areaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                type="danger"
                onConfirm={handleDeleteArea}
                onCancel={() => setShowDeleteAreaModal(false)}
            />

            {/* Delete Grupo Confirm Modal */}
            <ConfirmModal
                show={showDeleteGrupoModal}
                title="Eliminar Grupo"
                message={`¿Estás seguro de eliminar el grupo "${grupoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                type="danger"
                onConfirm={handleDeleteGrupo}
                onCancel={() => setShowDeleteGrupoModal(false)}
            />
        </AppLayout>
    );
}

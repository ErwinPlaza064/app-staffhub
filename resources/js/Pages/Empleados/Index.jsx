import { useState, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useToast } from "@/Contexts/ToastContext";
import Icons from "@/Components/Icons";
import StatCard from "@/Components/Empleados/StatCard";
import EmpleadosTable from "@/Components/Empleados/EmpleadosTable";
import EmpleadoFormModal from "@/Components/Empleados/EmpleadoFormModal";
import ImportModal from "@/Components/Empleados/ImportModal";
import BajaModal from "@/Components/Empleados/BajaModal";

export default function EmpleadosIndex({
    empleados,
    contadores,
    areas = [],
    grupos = [],
    filtros,
}) {
    const { showSuccess, showError } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [showBajaModal, setShowBajaModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState(null);
    const [empleadoToBaja, setEmpleadoToBaja] = useState(null);
    const [activeFilter, setActiveFilter] = useState(filtros?.area || "Todos");
    const [searchQuery, setSearchQuery] = useState(filtros?.search || "");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        numero_nomina: "",
        nombre: "",
        area: areas[0]?.nombre || "Staff",
        puesto: "",
        grupo: grupos[0]?.nombre || "A",
    });

    const {
        data: bajaData,
        setData: setBajaData,
        post: postBaja,
        processing: processingBaja,
        reset: resetBaja,
    } = useForm({
        motivo_baja: "",
        fecha_baja: new Date().toISOString().split("T")[0],
    });

    const tableRef = useRef(null);

    // Handler para click en cards de estadísticas
    const handleCardClick = (area) => {
        setActiveFilter(area);
        router.get(
            route("empleados.index"),
            { area: area },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setTimeout(() => {
                        tableRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }, 100);
                },
            }
        );
    };

    const openModal = (empleado = null) => {
        if (empleado) {
            setEditingEmpleado(empleado);
            setData({
                id: empleado.Id || empleado.id,
                numero_nomina: empleado.numero_nomina,
                nombre: empleado.nombre,
                area: empleado.area,
                puesto: empleado.puesto,
                grupo: empleado.grupo,
            });
        } else {
            setEditingEmpleado(null);
            setData({
                numero_nomina: "",
                nombre: "",
                area: areas[0]?.nombre || "Staff",
                puesto: "",
                grupo: grupos[0]?.nombre || "A",
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEmpleado(null);
        reset();
    };

    const openBajaModal = (empleado) => {
        setEmpleadoToBaja(empleado);
        setBajaData({
            motivo_baja: "",
            fecha_baja: new Date().toISOString().split("T")[0],
        });
        setShowBajaModal(true);
    };

    const closeBajaModal = () => {
        setShowBajaModal(false);
        setEmpleadoToBaja(null);
        resetBaja();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(route("empleados.update", data.id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    showSuccess("Empleado actualizado exitosamente");
                    router.visit(route("empleados.index"), {
                        preserveState: false,
                        preserveScroll: true,
                    });
                },
                onError: (errors) => {
                    showError("Error al actualizar el empleado");
                },
            });
        } else {
            post(route("empleados.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    showSuccess("Empleado registrado exitosamente");
                    router.visit(route("empleados.index"), {
                        preserveState: false,
                        preserveScroll: true,
                    });
                },
                onError: (errors) => {
                    showError("Error al registrar el empleado");
                },
            });
        }
    };

    const handleBaja = (e) => {
        e.preventDefault();
        const empleadoId = empleadoToBaja.Id || empleadoToBaja.id;

        postBaja(route("empleados.baja", empleadoId), {
            preserveScroll: true,
            onSuccess: () => {
                closeBajaModal();
                showSuccess(`${empleadoToBaja.nombre} dado de baja exitosamente`);
                router.visit(route("empleados.index"), {
                    preserveState: false,
                    preserveScroll: true,
                });
            },
            onError: () => {
                showError("Error al dar de baja al empleado");
            },
        });
    };

    const handleFilter = (area) => {
        setActiveFilter(area);
        router.get(
            route("empleados.index"),
            { area, search: searchQuery },
            { preserveState: true }
        );
    };

    const handleImport = (importFile) => {
        if (!importFile) return;

        const formData = new FormData();
        formData.append("file", importFile);

        router.post(route("empleados.import"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowImportModal(false);
                showSuccess("Empleados importados exitosamente");
                router.visit(route("empleados.index"), {
                    preserveState: false,
                    preserveScroll: true,
                });
            },
            onError: (errors) => {
                showError(errors.import || "Error al importar el archivo");
            },
        });
    };

    const goToBajas = () => {
        router.visit(route("bajas.index"));
    };

    return (
        <AppLayout>
            <Head title="Gestión de Empleados - StaffHub" />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatCard
                    title="Total Empleados"
                    value={contadores?.total || 0}
                    icon={Icons.Users}
                    color="primary"
                    onClick={() => handleCardClick("Todos")}
                    active={activeFilter === "Todos"}
                />
                <StatCard
                    title="Staff"
                    value={contadores?.staff || 0}
                    icon={Icons.Staff}
                    color="staff"
                    onClick={() => handleCardClick("Staff")}
                    active={activeFilter === "Staff"}
                />
                <StatCard
                    title="Calidad"
                    value={contadores?.calidad || 0}
                    icon={Icons.Clipboard}
                    color="calidad"
                    onClick={() => handleCardClick("Calidad")}
                    active={activeFilter === "Calidad"}
                />
                <StatCard
                    title="Producción"
                    value={contadores?.produccion || 0}
                    icon={Icons.Factory}
                    color="produccion"
                    onClick={() => handleCardClick("Producción")}
                    active={activeFilter === "Producción"}
                />
                <StatCard
                    title="Almacén"
                    value={contadores?.almacen || 0}
                    icon={Icons.Box}
                    color="almacen"
                    onClick={() => handleCardClick("Almacén")}
                    active={activeFilter === "Almacén"}
                />
                <StatCard
                    title="Mantenimiento"
                    value={contadores?.mantenimiento || 0}
                    icon={Icons.Wrench}
                    color="mantenimiento"
                    onClick={() => handleCardClick("Mantenimiento")}
                    active={activeFilter === "Mantenimiento"}
                />
                <StatCard
                    title="Bajas"
                    value={contadores?.bajas || 0}
                    icon={Icons.UserMinus}
                    color="bajas"
                    onClick={goToBajas}
                />
            </div>

            {/* Empleados Table */}
            <EmpleadosTable
                empleados={empleados}
                activeFilter={activeFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterChange={handleFilter}
                onEdit={openModal}
                onBaja={openBajaModal}
                onOpenImportModal={() => setShowImportModal(true)}
                areas={areas}
                tableRef={tableRef}
            />

            {/* Add/Edit Modal */}
            <EmpleadoFormModal
                show={showModal}
                onClose={closeModal}
                empleado={editingEmpleado}
                areas={areas}
                grupos={grupos}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
            />

            {/* Import Modal */}
            <ImportModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImport}
            />

            {/* Baja Confirmation Modal */}
            <BajaModal
                show={showBajaModal}
                onClose={closeBajaModal}
                empleado={empleadoToBaja}
                bajaData={bajaData}
                setBajaData={setBajaData}
                processing={processingBaja}
                onSubmit={handleBaja}
            />
        </AppLayout>
    );
}

import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Icons from "@/Components/Icons";
import CasilleroStatCard from "@/Components/Casilleros/CasilleroStatCard";
import LockersGrid from "@/Components/Casilleros/LockersGrid";
import AsignarModal from "@/Components/Casilleros/AsignarModal";
import CrearCasilleroModal from "@/Components/Casilleros/CrearCasilleroModal";
import LiberarModal from "@/Components/Casilleros/LiberarModal";
import VirtualTourModal from "@/Components/Casilleros/VirtualTourModal";

export default function CasillerosIndex({
    casillerosHombres,
    casillerosMujeres,
    contadores,
    empleadosSinCasillero,
    filtros,
}) {
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showLiberarModal, setShowLiberarModal] = useState(false);
    const [showVirtualTour, setShowVirtualTour] = useState(false);
    const [virtualTourArea, setVirtualTourArea] = useState(null);
    const [selectedCasillero, setSelectedCasillero] = useState(null);
    const [casilleroToLiberar, setCasilleroToLiberar] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        numero_casillero: "",
        tipo: "Hombres",
        estatus: "Disponible",
        emp_id: "",
    });

    const asignarForm = useForm({
        emp_id: "",
    });

    const openAsignarModal = (casillero) => {
        setSelectedCasillero(casillero);
        asignarForm.reset();
        setShowAsignarModal(true);
    };

    const closeAsignarModal = () => {
        setShowAsignarModal(false);
        setSelectedCasillero(null);
        asignarForm.reset();
    };

    const handleAsignar = (e) => {
        e.preventDefault();
        asignarForm.post(
            route(
                "casilleros.asignar",
                selectedCasillero.Id || selectedCasillero.id
            ),
            {
                onSuccess: () => closeAsignarModal(),
            }
        );
    };

    const openLiberarModal = (casillero) => {
        setCasilleroToLiberar(casillero);
        setShowLiberarModal(true);
    };

    const closeLiberarModal = () => {
        setShowLiberarModal(false);
        setCasilleroToLiberar(null);
    };

    const handleLiberar = () => {
        const id = casilleroToLiberar.Id || casilleroToLiberar.id;
        router.post(
            route("casilleros.liberar", id),
            {},
            {
                onSuccess: () => closeLiberarModal(),
            }
        );
    };

    const openCrearModal = () => {
        reset();
        setShowCrearModal(true);
    };

    const closeCrearModal = () => {
        setShowCrearModal(false);
        reset();
    };

    const handleCrear = (e) => {
        e.preventDefault();
        post(route("casilleros.store"), {
            onSuccess: () => closeCrearModal(),
        });
    };

    return (
        <AppLayout>
            <Head title="Registro de Lockers - StaffHub" />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                <CasilleroStatCard
                    title="Total Casilleros"
                    value={contadores?.total || 0}
                    subtitle={`${contadores?.disponibles || 0} disponibles`}
                />
                <CasilleroStatCard title="Ocupados" value={contadores?.ocupados || 0} />
                <CasilleroStatCard
                    title="Hombres"
                    value={contadores?.hombres?.total || 0}
                    subtitle={`${
                        contadores?.hombres?.disponibles || 0
                    } disponibles`}
                    color="blue"
                />
                <CasilleroStatCard
                    title="Mujeres"
                    value={contadores?.mujeres?.total || 0}
                    subtitle={`${
                        contadores?.mujeres?.disponibles || 0
                    } disponibles`}
                    color="pink"
                />
            </div>

            {/* Lockers Grid */}
            <LockersGrid
                casillerosHombres={casillerosHombres}
                casillerosMujeres={casillerosMujeres}
                contadores={contadores}
                onAsignar={openAsignarModal}
                onLiberar={openLiberarModal}
                onOpenVirtualTour={(area) => {
                    setVirtualTourArea(area);
                    setShowVirtualTour(true);
                }}
            />

            {/* Add Locker Button */}
            <div className="flex justify-center gap-4 mt-6">
                <a
                    href={route('casilleros.export.pdf')}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all shadow-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                >
                    <Icons.PDF />
                    Exportar PDF
                </a>
                
                <button
                    onClick={openCrearModal}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all shadow-lg bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 rounded-xl shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
                >
                    <Icons.Plus />
                    Registrar Locker
                </button>
            </div>

            {/* Asignar Modal */}
            <AsignarModal
                show={showAsignarModal}
                onClose={closeAsignarModal}
                casillero={selectedCasillero}
                empleadosSinCasillero={empleadosSinCasillero}
                form={asignarForm}
                onSubmit={handleAsignar}
            />

            {/* Crear Casillero Modal */}
            <CrearCasilleroModal
                show={showCrearModal}
                onClose={closeCrearModal}
                empleadosSinCasillero={empleadosSinCasillero}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleCrear}
            />

            {/* Liberar Casillero Modal */}
            <LiberarModal
                show={showLiberarModal}
                onClose={closeLiberarModal}
                casillero={casilleroToLiberar}
                onConfirm={handleLiberar}
            />

            {/* Virtual Tour 360° Modal */}
            <VirtualTourModal
                show={showVirtualTour}
                onClose={() => {
                    setShowVirtualTour(false);
                    setVirtualTourArea(null);
                }}
                area={virtualTourArea}
            />
        </AppLayout>
    );
}

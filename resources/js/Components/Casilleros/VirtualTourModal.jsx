import { useEffect, useRef, useState } from "react";
import Modal from "@/Components/Modal";
import Icons from "@/Components/Icons";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";

export default function VirtualTourModal({ show, onClose, area = null }) {
    const viewerRef = useRef(null);
    const containerRef = useRef(null);
    const [fotos, setFotos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Cargar fotos desde la API
    useEffect(() => {
        if (show) {
            fetchFotos();
        }
    }, [show, area]);

    const fetchFotos = async () => {
        try {
            const response = await fetch(route("casilleros.fotos.index"));
            const data = await response.json();
            
            // Filtrar por área si se especifica
            const fotosFiltradas = area 
                ? data.filter(foto => foto.area === area)
                : data;
            
            setFotos(fotosFiltradas);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar fotos 360°:", error);
            setLoading(false);
        }
    };

    // Inicializar el visor cuando se abre el modal
    useEffect(() => {
        if (show && fotos.length > 0 && containerRef.current && !viewerRef.current) {
            viewerRef.current = new Viewer({
                container: containerRef.current,
                panorama: fotos[0].image_url,
                caption: fotos[0].nombre,
                loadingImg: null,
                navbar: [
                    "zoom",
                    "move",
                    "fullscreen",
                    {
                        title: "Descripción",
                        content: fotos[0].descripcion || "",
                        className: "custom-button",
                    },
                ],
                defaultZoomLvl: 50,
                mousewheel: true,
                mousemove: true,
                keyboard: "always",
            });
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, [show, fotos]);

    // Cambiar panorama cuando cambia el índice
    const changePanorama = (index) => {
        if (viewerRef.current && fotos[index]) {
            setCurrentIndex(index);
            viewerRef.current.setPanorama(fotos[index].image_url, {
                caption: fotos[index].nombre,
            });
        }
    };

    const handlePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : fotos.length - 1;
        changePanorama(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex < fotos.length - 1 ? currentIndex + 1 : 0;
        changePanorama(newIndex);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="full">
            <div className="relative h-screen bg-black">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Tour Virtual - Casilleros
                            </h2>
                            {fotos[currentIndex] && (
                                <p className="text-sm text-gray-300">
                                    {fotos[currentIndex].nombre}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Visor 360° */}
                <div ref={containerRef} className="w-full h-full" />

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                            <svg
                                className="animate-spin h-12 w-12 mx-auto mb-4"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <p>Cargando tour virtual...</p>
                        </div>
                    </div>
                )}

                {/* No Photos State */}
                {!loading && fotos.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                            <Icons.Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">
                                No hay fotos panorámicas
                            </h3>
                            <p className="text-gray-400">
                                Sube fotos 360° para visualizar el tour virtual
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                {fotos.length > 1 && !loading && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                        >
                            <Icons.ArrowLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </button>
                    </>
                )}

                {/* Area Selector */}
                {fotos.length > 1 && !loading && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="flex gap-2 bg-black/70 p-2 rounded-lg">
                            {fotos.map((foto, index) => (
                                <button
                                    key={foto.id}
                                    onClick={() => changePanorama(index)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        currentIndex === index
                                            ? "bg-primary-500 text-white"
                                            : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                                >
                                    {foto.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

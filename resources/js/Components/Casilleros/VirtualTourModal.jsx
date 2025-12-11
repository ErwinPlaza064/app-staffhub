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
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cargar fotos desde la API
    useEffect(() => {
        if (show) {
            setLoading(true);
            setCurrentIndex(0);
            fetchFotos();
        }
        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, [show, area]);

    const fetchFotos = async () => {
        try {
            const response = await fetch(route("casilleros.fotos.index"));
            const data = await response.json();
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

    // Inicializar visor 360° SOLO en desktop
    useEffect(() => {
        if (show && !isMobile && fotos.length > 0 && containerRef.current && !viewerRef.current) {
            try {
                viewerRef.current = new Viewer({
                    container: containerRef.current,
                    panorama: fotos[currentIndex].image_url,
                    caption: fotos[currentIndex].nombre,
                    loadingImg: null,
                    navbar: ["zoom", "move", "fullscreen"],
                    defaultZoomLvl: 50,
                    minFov: 30,
                    maxFov: 90,
                    mousewheel: true,
                    mousemove: true,
                    keyboard: true,
                });
            } catch (error) {
                console.error("Error al inicializar visor:", error);
            }
        }
    }, [show, fotos, isMobile, currentIndex]);

    const changePanorama = (index) => {
        setCurrentIndex(index);
        if (!isMobile && viewerRef.current && fotos[index]) {
            viewerRef.current.setPanorama(fotos[index].image_url);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="full">
            <div className="relative bg-black" style={{ height: '100vh', minHeight: '100dvh' }}>
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-white">
                                {area ? `Casilleros ${area}` : 'Tour Virtual'}
                            </h2>
                            {fotos[currentIndex] && (
                                <p className="text-sm text-gray-300">{fotos[currentIndex].nombre}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white bg-black/50 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
                        <div className="text-center text-white">
                            <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p>Cargando...</p>
                        </div>
                    </div>
                )}

                {/* No Photos */}
                {!loading && fotos.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <Icons.Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No hay fotos panorámicas</h3>
                            <p className="text-gray-400">Sube fotos 360° para ver el tour</p>
                        </div>
                    </div>
                )}

                {/* Desktop: Photo Sphere Viewer */}
                {!isMobile && !loading && fotos.length > 0 && (
                    <div 
                        ref={containerRef} 
                        className="w-full h-full"
                        style={{ position: 'absolute', inset: 0 }}
                    />
                )}

                {/* Mobile: Scrollable Panoramic View */}
                {isMobile && !loading && fotos.length > 0 && (
                    <div className="absolute inset-0 flex flex-col">
                        {/* Space for header */}
                        <div className="h-16"></div>
                        
                        {/* Scrollable container */}
                        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-900">
                            <img 
                                src={fotos[currentIndex].image_url}
                                alt={fotos[currentIndex].nombre}
                                className="h-full object-cover"
                                style={{ 
                                    width: 'auto',
                                    minWidth: '300vw',
                                    maxHeight: 'calc(100vh - 10rem)'
                                }}
                                onLoad={() => console.log('Imagen cargada')}
                                onError={(e) => {
                                    console.error('Error cargando imagen');
                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="%23333"/><text x="50%" y="50%" fill="%23fff" text-anchor="middle">Error al cargar imagen</text></svg>';
                                }}
                            />
                        </div>
                        
                        {/* Hint text */}
                        <div className="h-16 flex items-center justify-center bg-black">
                            <p className="text-white/70 text-sm">
                                👆 Desliza horizontalmente para explorar
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation for multiple photos */}
                {fotos.length > 1 && !loading && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="flex gap-2 bg-black/80 p-2 rounded-lg">
                            {fotos.map((foto, index) => (
                                <button
                                    key={foto.id}
                                    onClick={() => changePanorama(index)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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


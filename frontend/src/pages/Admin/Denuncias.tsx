// import { Link } from "react-router";
import { useState, useEffect } from "react";
// import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "sonner";

interface Denuncia {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: string;
    estado: "pendiente" | "en_proceso" | "resuelta" | "rechazada";
    denunciante: string;
}

export const Denuncias = () => {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    // const { user } = useAuthContext();

    // Simular datos de denuncias
    useEffect(() => {
        // En un caso real, aquí harías una llamada API
        setLoading(true);
        setTimeout(() => {
            const mockDenuncias = Array.from({ length: 45 }, (_, i) => ({
                id: `DEN-${2023000 + i}`,
                titulo: `Denuncia por ${["ruidos molestos", "basura en vía pública", "construcción irregular", "establecimiento sin licencia"][i % 4]}`,
                descripcion: `Descripción detallada de la denuncia #${i + 1}...`,
                fecha: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
                estado: ["pendiente", "en_proceso", "resuelta", "rechazada"][i % 4] as "pendiente" | "en_proceso" | "resuelta" | "rechazada",
                denunciante: `Ciudadano ${i + 1}`
            }));
            setDenuncias(mockDenuncias);
            setTotalPages(Math.ceil(mockDenuncias.length / itemsPerPage));
            setLoading(false);
        }, 800);
    }, []);

    // Asignar denuncia a administrador actual
    const asignarDenuncia = (id: string) => {
        // En un caso real, harías una llamada API
        setDenuncias(prev => prev.filter(denuncia => denuncia.id !== id));
        toast.success("Denuncia asignada correctamente", {
            description: `La denuncia ${id} ha sido asignada a tu bandeja de trabajo.`
        });
    };

    // Obtener denuncias para la página actual
    const denunciasPaginadas = denuncias.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Estado para badge
    const getEstadoClass = (estado: string) => {
        switch (estado) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "en_proceso":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "resuelta":
                return "bg-green-100 text-green-800 border-green-200";
            case "rechazada":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="container mx-auto my-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Denuncias Disponibles
                </h2>
                <div className="text-sm text-gray-600">
                    Mostrando {denunciasPaginadas.length} de {denuncias.length} denuncias
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--primary-color)"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-(--primary-color) text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Denuncia
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Denunciante
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {denunciasPaginadas.map((denuncia) => (
                                    <tr key={denuncia.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {denuncia.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{denuncia.titulo}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{denuncia.descripcion}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {denuncia.fecha}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(denuncia.estado)}`}>
                                                {denuncia.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {denuncia.denunciante}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => asignarDenuncia(denuncia.id)}
                                                className="bg-(--secondary-color) cursor-pointer text-white px-3 py-1.5 rounded hover:bg-(--primary-color) transition duration-300 ease-in-out flex items-center"
                                            >
                                                <i className="fas fa-plus mr-1.5"></i>
                                                Recibir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            
                            {/* Números de página */}
                            <div className="hidden sm:flex space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum
                                    if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }
                                    if (pageNum <= 0 || pageNum > totalPages) return null
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-2 border rounded-md text-sm font-medium ${
                                                pageNum === currentPage
                                                    ? "bg-(--primary-color) text-white border-(--primary-color)"
                                                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
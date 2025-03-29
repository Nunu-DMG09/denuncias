import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../useAuthContext";
import { authApi } from "../../../utils/apiAxios";
import { toast } from "sonner";
import { DenunciaRecibida } from "../../../types";

export const useAdminDenunciasRecibidas = (itemsPerPage : number = 10) => {
    const [denuncias, setDenuncias] = useState<DenunciaRecibida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const { user } = useAuthContext();

    const fetchDenunciasRecibidas = useCallback(async() => {
        if (!user?.dni_admin) {
            setError("No se pudo obtener el DNI del administrador");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await authApi.get(`/recibida`, {
                params: {
                    dni_admin: user.dni_admin
                }
            });
            if (response.data && Array.isArray(response.data)) {
                const denunciasFormateadas: DenunciaRecibida[] = response.data.map((denuncia : DenunciaRecibida) => ({
                    tracking_code: denuncia.tracking_code,
                    estado: denuncia.estado,
                    fecha_registro: denuncia.fecha_registro,
                    denunciante_nombre: denuncia.denunciante_nombre,
                    denunciante_dni: denuncia.denunciante_dni,
                    denunciado_nombre: denuncia.denunciado_nombre,
                    denunciado_dni: denuncia.denunciado_dni,
                    motivo: denuncia.motivo,
                    descripcion: denuncia.descripcion,
                    fecha_incidente: denuncia.fecha_incidente,
                }));
                setDenuncias(denunciasFormateadas);
                setTotalPages(Math.ceil(denunciasFormateadas.length / itemsPerPage));
                setError(null);
            } else {
                setDenuncias([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error al obtener las denuncias:", error);
            if (error instanceof Error) {
                setError(error.message || "Ocurrió un error al obtener las denuncias");
            } else {
                setError("Ocurrió un error al obtener las denuncias");
            }
            toast.error("Error al cargar las denuncias", {
                description: "No se pudieron cargar las denuncias, por favor intenta de nuevo"
            });
        } finally {
            setLoading(false);
        }
    }, [user?.dni_admin, itemsPerPage]);
    useEffect(() => {
        fetchDenunciasRecibidas();
    }, [fetchDenunciasRecibidas]);
    // Esto se cambiará a un hook de paginación compartido entre los dos componentes

    const handleCurrentPage = (action: "next" | "prev") => {
        if (action === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (action === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const getVisiblePageNumbers = (): number[] => {
        return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            
            // Si estamos cerca del inicio
            if (currentPage <= 3) {
                pageNum = i + 1;
            }
            // Si estamos cerca del final
            else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
            }
            // Si estamos en el medio
            else {
                pageNum = currentPage - 2 + i;
            }
            
            // Verificar que el número calculado esté en el rango válido
            if (pageNum <= 0 || pageNum > totalPages) {
                return currentPage;
            }
            
            return pageNum;
        }).filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados
    };
    const denunciasPaginadas = denuncias.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const toggleRowExpansion = (tracking_code: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [tracking_code]: !prev[tracking_code]
        }));
    }
    return {
        denuncias,
        denunciasPaginadas,
        loading,
        error,
        totalPages,
        currentPage,
        handleCurrentPage,
        handlePageChange,
        getVisiblePageNumbers,
        toggleRowExpansion,
        expandedRows,
    }
}
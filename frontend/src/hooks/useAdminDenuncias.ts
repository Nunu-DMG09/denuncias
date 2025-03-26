import { useState, useEffect, useCallback } from "react";
import { authApi } from "../utils/apiAxios";
import { toast } from "sonner";

interface Denuncia {
	tracking_code: string;
	fecha_registro: string;
	estado: string;
	denunciante_nombre: string;
	denunciante_dni: string;
	denunciado_nombre: string;
	motivo: string;
}

export const useAdminDenuncias = (itemsPerPage: number = 10) => {
	const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	const fetchDenuncias = useCallback(async () => {
		try {
			setLoading(true);
			const response = await authApi.get("/denuncias");

			const denunciasFormateadas: Denuncia[] = response.data.map(
				(denuncia: Denuncia) => ({
					tracking_code: denuncia.tracking_code,
					fecha_registro: denuncia.fecha_registro,
					estado: denuncia.estado,
					denunciante_nombre: denuncia.denunciante_nombre,
					denunciante_dni: denuncia.denunciante_dni,
					denunciado_nombre: denuncia.denunciado_nombre,
					motivo: denuncia.motivo,
				})
			);
			setDenuncias(denunciasFormateadas);
			setTotalPages(
				Math.ceil(denunciasFormateadas.length / itemsPerPage)
			);
			setError(null);
		} catch (error) {
			console.error("Error al obtener las denuncias:", error);
			if (error instanceof Error) {
				setError(
					error.message || "Ocurrió un error al obtener las denuncias"
				);
			} else {
				setError("Ocurrió un error al obtener las denuncias");
			}
			toast.error("Error al cargar las denuncias", {
				description:
					"No se pudieron cargar las denuncias, por favor intenta de nuevo",
			});
		} finally {
			setLoading(false);
		}
	}, [itemsPerPage]);

	useEffect(() => {
		fetchDenuncias();
	}, [fetchDenuncias]);

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
	// asignar denuncia aqui

	const denunciasPaginadas = denuncias.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const getVisiblePageNumbers = () => {
		return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
			let pageNum;
			if (currentPage <= 3) {
				pageNum = i + 1;
			}
			else if (currentPage >= totalPages - 2) {
				pageNum = totalPages - 4 + i;
			}
			else {
				pageNum = currentPage - 2 + i;
			}
			if (pageNum <= 0 || pageNum > totalPages) {
				return null;
			}
			return pageNum;
		}).filter((page) => page !== null) as number[];
	};

	return {
		denuncias,
		loading,
		error,
		totalPages,
		currentPage,
		setCurrentPage,
		denunciasPaginadas,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers
	};
};

import { useCallback, useEffect, useState } from "react";
import { authApi } from "../../utils/apiAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { usePagination } from "../usePagination";
interface HistorialAdmins {
	id: string;
	realizado_por: string;
	dni_admin: string;
	accion: string;
	motivo: string;
	fecha_accion: string;
	admin_nombre: string;
	admin_categoria: string;
}
export const useAdminHistorial = (itemsPerPage: number = 10) => {
	const [historial, setHistorial] = useState<HistorialAdmins[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const {
		currentPage,
		totalPages,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
		paginatedItems: historialPaginado,
	} = usePagination(historial, itemsPerPage);

	const getHistorial = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await authApi.get("/history");
			if (response.data && response.data.error) {
				setHistorial([]);
				setError(null);
				toast.info(
					response.data.error ||
						"No se encontraron registros en el historial"
				);
				return;
			}
			if (response.data && Array.isArray(response.data)) {
				const sortedData = [...response.data].sort(
					(a, b) =>
						new Date(b.fecha_accion).getTime() -
						new Date(a.fecha_accion).getTime()
				);
				setHistorial(sortedData);
				setError(null);
				toast.success("Historial cargado correctamente", {
					id: "historial-success",
				});
			} else {
				setHistorial([]);
				const errorMsg = "Formato de respuesta inesperado";
				setError(errorMsg);
				toast.warning(errorMsg);
			}
		} catch (err) {
			const axiosError = err as AxiosError<{
				message?: string;
				error?: string;
			}>;

			let errorMsg = "Error al obtener el historial de administradores";

			if (axiosError.response) {
				const serverMessage =
					axiosError.response.data?.message ||
					axiosError.response.data?.error ||
					`Error ${axiosError.response.status}: ${axiosError.response.statusText}`;

				errorMsg = `${errorMsg}: ${serverMessage}`;
			} else if (axiosError.request) {
				errorMsg =
					"No se pudo conectar con el servidor. Verifique su conexión.";
			}
			setError(errorMsg);
			toast.error(errorMsg, {
				description:
					axiosError.message || "Intente nuevamente más tarde",
			});
			console.error("Error en getHistorial:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		getHistorial();
	}, [getHistorial]);

	return {
		historial,
		loading,
		error,
		refetch: getHistorial,
		historialPaginado,
		currentPage,
		totalPages,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
	};
};

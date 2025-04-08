import { useCallback, useEffect, useState } from "react";
import { authApi } from "../../utils/apiAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";
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
export const useAdminHistorial = () => {
	const [historial, setHistorial] = useState<HistorialAdmins[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const getHistorial = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await authApi.get("/history");
			if (response.data) {
				setHistorial(response.data);
				toast.success("Historial cargado correctamente", {
					id: "historial-success",
				});
			} else {
				const errorMsg = "No se encontraron registros en el historial";
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

	return { historial, loading, error, refetch: getHistorial };
};

import { authApi } from "../../utils/apiAxios";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { Administrador } from "../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios";

export const useSearchAdmin = () => {
    const [dniAdmin, setDniAdmin] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [adminData, setAdminData] = useState<Administrador | null>(null);

    const handleDniChange = (value: string) => {
        setDniAdmin(value);
    }
    
    const getAdminInfo = useCallback(async (dni: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.get(`/searchAdmin`, {
                params: { dni_admin: dni },
            });
            return response.data;
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            console.error("Error completo:", err);
            console.error("URL de la petición:", axiosError.config?.url);
            const errorMsg =
                axiosError.response?.data?.message ||
                "Error al obtener la información del administrador";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [])
    const handleSearch = async () => {
        if (!dniAdmin.trim()) {
            toast.error("Por favor, ingrese un DNI válido");
            return;
        }
        const data = await getAdminInfo(dniAdmin);
        if (data) {
            setAdminData(data);
        }
    }
    return {
        loading,
        dniAdmin,
        error,
        adminData,
        handleDniChange,
        handleSearch,
    }
}
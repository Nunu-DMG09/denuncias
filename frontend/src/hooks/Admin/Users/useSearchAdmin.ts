import { authApi } from "../../../utils/apiAxios";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { Administrador } from "../../../types";

export const useSearchAdmin = () => {
    const [dniAdmin, setDniAdmin] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [adminData, setAdminData] = useState<Administrador | null>(null);
    const [editAction, setEditAction] = useState<'password' | 'state' | 'role' | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleDniChange = (value: string) => {
        const dniFormatted = value.replace(/\D/g, ""); 
        setDniAdmin(dniFormatted);
        if (adminData) {
            setAdminData(null);
        }
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
    const handleEditStart = (action: 'password' | 'state' | 'role') => {
        setEditAction(action);
        setShowForm(true);
    }
    const handleEditCancel = () => {
        setShowForm(false);
        setEditAction(null);
    }
    const handleEditComplete = async () => {
        setShowForm(false);
        setEditAction(null);
        if (dniAdmin) {
            const updatedData = await getAdminInfo(dniAdmin);
            if (updatedData) {
                setAdminData(updatedData);
                toast.success("Actualización exitosa");
            }
        }
    }
    return {
        loading,
        dniAdmin,
        error,
        adminData,
        handleDniChange,
        handleSearch,
        editAction,
        showForm,
        handleEditComplete,
        handleEditCancel,
        handleEditStart
    }
}
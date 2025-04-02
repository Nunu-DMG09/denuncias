import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../../utils/apiAxios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Administrador } from '../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios';
interface AdminData {
    dni_admin: string;
    nombres: string;
    password: string;
    categoria: 'admin' | 'super_admin';
    estado: 'activo' | 'inactivo';
}

export const useAdministrador = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [administradores, setAdministradores] = useState<Administrador[]>([]);

    // Obtener todos los administradores
    const getAdministradores = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.get('/administradores');
            setAdministradores(response.data);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            console.error('Error completo:', err);
            console.error('URL de la petición:', axiosError.config?.url);
            const errorMsg = axiosError.response?.data?.message || 'Error al obtener los administradores';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);
    const createAdministrador = async (data: AdminData): Promise<Administrador | undefined> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.post('/administradores', data);
            toast.success('Administrador creado exitosamente');
            return response.data;
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string; error?: string }>;
            console.error('Error completo:', err);
            console.error('Status:', axiosError.response?.status);
            console.error('Data:', axiosError.response?.data);
            let errorMsg = 'Error al crear el administrador';
            if (axiosError.response?.status === 400 && axiosError.response.data?.error?.includes('Ya existe')) {
                errorMsg = `El administrador con DNI ${data.dni_admin} ya está registrado en el sistema`;
            } else {
                errorMsg = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Error al crear el administrador';
            }
            setError(errorMsg);
            toast.error(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    };
    const updateAdministrador = async (dni: string, data: AdminData): Promise<Administrador> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.put(`/administradores/${dni}`, data);
            toast.success('Administrador actualizado exitosamente');
            return response.data;
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMsg = axiosError.response?.data?.message || 'Error al actualizar el administrador';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAdministradores()
    }, [getAdministradores])

    return {
        loading,
        error,
        getAdministradores,
        createAdministrador,
        updateAdministrador,
        administradores
    };
};

export default useAdministrador;



import { useState } from 'react';
import { authApi } from '../../utils/apiAxios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface Administrador {
    dni_admin: string;
    nombres: string;
    categoria: 'admin' | 'super_admin';
    estado: 'activo' | 'inactivo';
}

interface CreateAdminData {
    dni_admin: string;
    nombres: string;
    password: string;
    categoria: 'admin' | 'super_admin';
    estado: 'activo' | 'inactivo';
}

interface UpdateAdminData {
    nombres?: string;
    password?: string;
    categoria?: 'admin' | 'super_admin';
    estado?: 'activo' | 'inactivo';
}

export const useAdministrador = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Obtener todos los administradores
    const getAdministradores = async (): Promise<Administrador[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.get('/administradores');
            console.log('Respuesta:', response.data);
            return response.data;
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
    };

    // Crear un nuevo administrador
    const createAdministrador = async (data: CreateAdminData): Promise<Administrador> => {
        setLoading(true);
        setError(null);
        try {
            console.log('Datos a enviar:', data);
            
            const response = await authApi.post('/administradores', data);
            
            console.log('Respuesta del servidor:', response);
            
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
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un administrador
    const updateAdministrador = async (dni: string, data: UpdateAdminData): Promise<Administrador> => {
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

    // Eliminar un administrador
    const deleteAdministrador = async (dni: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await authApi.delete(`/administradores/${dni}`);
            toast.success('Administrador eliminado exitosamente');
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMsg = axiosError.response?.data?.message || 'Error al eliminar el administrador';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Cambiar estado de un administrador
    const toggleEstadoAdministrador = async (dni: string): Promise<Administrador> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.patch(`/administradores/${dni}/toggle-estado`);
            toast.success('Estado del administrador actualizado exitosamente');
            return response.data;
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMsg = axiosError.response?.data?.message || 'Error al cambiar el estado del administrador';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getAdministradores,
        createAdministrador,
        updateAdministrador,
        deleteAdministrador,
        toggleEstadoAdministrador
    };
};

export default useAdministrador;



import { useCallback, useEffect, useState } from "react";
import { Administrador } from "../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios";
import useAdministrador from "./useAdministrador";
import { toast } from "sonner";

export const useEditAdmin = (admin: Administrador, onComplete?: () => void) => {
    // Estados centralizados para la edición
    const { updateAdministrador, loading } = useAdministrador();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [category, setCategory] = useState<'admin' | 'super_admin'>(admin.categoria);
    const [status, setStatus] = useState<'activo' | 'inactivo'>(admin.estado);
    const [error, setError] = useState<string | null>(null);

    // Resetear estados cuando cambia el admin a editar
    useEffect(() => {
        setPassword('');
        setConfirmPassword('');
        setCategory(admin.categoria);
        setStatus(admin.estado);
        setError(null);
    }, [admin]);

    // Gestión de contraseñas
    const handlePasswordSubmit = useCallback(async () => {
        // Validaciones
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return false;
        }

        try {
            await updateAdministrador(admin.dni_admin, {
                ...admin,
                password,
            });
            
            // Limpiar y notificar éxito
            setPassword('');
            setConfirmPassword('');
            setError(null);
            toast.success("Contraseña actualizada con éxito");
            
            if (onComplete) onComplete();
            return true;
        } catch (error) {
            console.error("Error al actualizar contraseña:", error);
            return false;
        }
    }, [password, confirmPassword, admin, updateAdministrador, onComplete]);

    // Gestión de cambio de categoría
    const handleCategorySubmit = useCallback(async () => {
        // Validar que haya cambios
        if (category === admin.categoria) {
            toast.info("No se han realizado cambios en la categoría");
            return true;
        }

        try {
            await updateAdministrador(admin.dni_admin, {
                ...admin,
                categoria: category,
            });
            
            toast.success(`Categoría actualizada a ${category === 'super_admin' ? 'Super Admin' : 'Admin'}`);
            
            if (onComplete) onComplete();
            return true;
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            return false;
        }
    }, [category, admin, updateAdministrador, onComplete]);

    // Gestión de cambio de estado
    const handleStatusSubmit = useCallback(async () => {
        // No validamos aquí ya que generalmente esto se maneja con un toggle
        try {
            const newStatus = admin.estado === 'activo' ? 'inactivo' : 'activo';
            setStatus(newStatus); // Actualizar estado local inmediatamente
            
            await updateAdministrador(admin.dni_admin, {
                ...admin,
                estado: newStatus,
            });
            
            toast.success(`Administrador ${newStatus === 'activo' ? 'activado' : 'desactivado'} con éxito`);
            
            if (onComplete) onComplete();
            return true;
        } catch (error) {
            // Revertir cambio local si hay error
            setStatus(admin.estado);
            console.error("Error al actualizar estado:", error);
            return false;
        }
    }, [admin, updateAdministrador, onComplete]);

    return {
        // Estados
        password,
        confirmPassword,
        category,
        status,
        error,
        loading,
        
        // Setters
        setPassword,
        setConfirmPassword,
        setCategory,
        setStatus,
        setError,
        
        // Submit handlers
        handlePasswordSubmit,
        handleCategorySubmit,
        handleStatusSubmit,
        
        // Helper para toggle de estado
        toggleStatus: handleStatusSubmit
    };
};

export default useEditAdmin;
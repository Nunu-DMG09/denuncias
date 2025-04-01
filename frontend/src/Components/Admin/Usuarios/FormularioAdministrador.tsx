// frontend/src/components/Admin/Usuarios/FormularioAdministrador.tsx
import { useState, useEffect } from 'react';
import useAdministrador from '../../../hooks/Admin/useAdministrador';
import { toast } from 'sonner';
import { getDNIData } from '../../../services/apisDocs';

// Definimos las interfaces necesarias
interface Administrador {
    dni_admin: string;
    nombres: string;
    categoria: 'admin' | 'super_admin';
    estado: 'activo' | 'inactivo';
}

interface FormularioAdministradorProps {
    administrador: Administrador | null;
    onClose: () => void;
}

// Definimos el tipo para la categoría
type CategoriaAdmin = 'admin' | 'super_admin';
type EstadoAdmin = 'activo' | 'inactivo';

// Definimos la interfaz para el formulario
interface FormData {
    dni_admin: string;
    nombres: string;
    password: string;
    categoria: CategoriaAdmin;
    estado: EstadoAdmin;
}

const FormularioAdministrador = ({ 
    administrador, 
    onClose 
}: FormularioAdministradorProps) => {
    const { createAdministrador, updateAdministrador } = useAdministrador();
    const [isLoading, setIsLoading] = useState(false);
    
    // Especificamos el tipo del estado del formulario
    const [formData, setFormData] = useState<FormData>({
        dni_admin: '',
        nombres: '',
        password: '',
        categoria: 'admin',
        estado: 'activo'
    });

    useEffect(() => {
        if (administrador) {
            setFormData({
                dni_admin: administrador.dni_admin,
                nombres: administrador.nombres,
                password: '',
                categoria: administrador.categoria,
                estado: administrador.estado
            });
        }
    }, [administrador]);

    const handleDNIChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const dni = e.target.value.replace(/\D/g, ''); // Solo permitir números
        
        setFormData(prev => ({
            ...prev,
            dni_admin: dni,
            nombres: dni.length === 8 ? prev.nombres : '' // Limpiar nombre si el DNI cambia
        }));

        if (dni.length === 8) {
            setIsLoading(true);
            try {
                const nombreCompleto = await getDNIData(dni);
                if (nombreCompleto) {
                    setFormData(prev => ({
                        ...prev,
                        nombres: nombreCompleto
                    }));
                } else {
                    toast.error('No se encontraron datos para este DNI');
                }
            } catch (error) {
                console.error('Error al consultar DNI:', error);
                toast.error('Error al consultar el DNI');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar longitud del DNI
        if (formData.dni_admin.length !== 8) {
            toast.error('El DNI debe tener 8 dígitos');
            return;
        }

        // Validar longitud de la contraseña
        if (!administrador && formData.password.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            if (administrador) {
                await updateAdministrador(administrador.dni_admin, {
                    nombres: formData.nombres,
                    password: formData.password || undefined,
                    categoria: formData.categoria,
                    estado: formData.estado
                });
            } else {
                await createAdministrador({
                    dni_admin: formData.dni_admin,
                    nombres: formData.nombres,
                    password: formData.password,
                    categoria: formData.categoria,
                    estado: formData.estado
                });
            }
            onClose();
            toast.success(
                administrador 
                ? 'Administrador actualizado exitosamente' 
                : 'Administrador creado exitosamente'
            );
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar el administrador');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
                {administrador ? 'Editar' : 'Nuevo'} Administrador
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        DNI
                    </label>
                    <input
                        type="text"
                        value={formData.dni_admin}
                        onChange={handleDNIChange}
                        disabled={!!administrador}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        maxLength={8}
                        required
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                        Nombres
                    </label>
                    <input
                        type="text"
                        value={formData.nombres}
                        onChange={(e) => setFormData({
                            ...formData,
                            nombres: e.target.value
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                        readOnly={!administrador}
                    />
                    {isLoading && (
                        <div className="absolute right-2 top-8">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Contraseña
                        {administrador && " (dejar en blanco para mantener la actual)"}
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({
                            ...formData,
                            password: e.target.value
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required={!administrador}
                        minLength={8}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Categoría
                    </label>
                    <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({
                            ...formData,
                            categoria: e.target.value as CategoriaAdmin
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="admin">Administrador</option>
                        <option value="super_admin">Super Administrador</option>
                    </select>
                </div>

                {administrador && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({
                                ...formData,
                                estado: e.target.value as EstadoAdmin
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {administrador ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioAdministrador;
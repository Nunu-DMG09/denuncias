// frontend/src/components/Admin/Usuarios/FormularioAdministrador.tsx
import { useState, useEffect } from 'react';
import useAdministrador from '../../../hooks/Admin/useAdministrador';
import { toast } from 'sonner';
import { getDNIData } from '../../../services/apisDocs';
import { Loader } from "../../Loaders/Loader";
import { Administrador } from '../../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios';
interface FormularioAdministradorProps {
    administrador: Administrador | null;
    actionType: 'password' | 'state' | 'role';
    onClose: () => void;
}
interface FormData {
    dni_admin: string;
    nombres: string;
    password: string;
    categoria: Administrador['categoria'];
    estado: Administrador['estado'];
}

const FormularioAdministrador = ({ 
    administrador, 
    onClose,
    actionType
}: FormularioAdministradorProps) => {
    const { loading } = useAdministrador();
    const [isLoading, setIsLoading] = useState(false);
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
            nombres: '' // Limpiar nombre cuando cambia el DNI
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
        } catch (error: any) {
            // No mostrar mensaje de error aquí ya que el hook useAdministrador ya lo maneja
            console.error('Error:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
                {administrador ? 'Editar' : 'Nuevo'} Administrador
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI
                    </label>
                    <input
                        type="text"
                        value={formData.dni_admin}
                        onChange={handleDNIChange}
                        disabled={!!administrador}
                        className="mt-1 block w-full p-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={8}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombres">
                        Nombres y Apellidos
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="nombres"
                            name="nombres"
                            value={formData.nombres}
                            readOnly
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {isLoading && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <Loader isBtn={false} />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="mt-1 block w-full p-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={!administrador}
                        minLength={8}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                    </label>
                    <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({
                            ...formData,
                            categoria: e.target.value as CategoriaAdmin
                        })}
                        className="mt-1 block w-full p-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="admin">Administrador</option>
                        <option value="super_admin">Super Administrador</option>
                    </select>
                </div>

                {administrador && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({
                                ...formData,
                                estado: e.target.value as EstadoAdmin
                            })}
                            className="mt-1 block w-full p-2.5 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
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
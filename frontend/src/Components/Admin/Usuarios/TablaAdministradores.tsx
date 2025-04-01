// frontend/src/components/Admin/Usuarios/TablaAdministradores.tsx
import { useEffect, useState } from 'react';
import useAdministrador from '../../../hooks/Admin/useAdministrador';
import { toast } from 'sonner';
import { Administrador } from '../../../pages/Admin/AdministrarUsuarios';

interface TablaAdministradoresProps {
    onEditar: (administrador: Administrador) => void;
}

const TablaAdministradores = ({ onEditar }: TablaAdministradoresProps) => {
    const {
        getAdministradores,
        deleteAdministrador,
        toggleEstadoAdministrador,
        loading
    } = useAdministrador();
    
    // Especificamos el tipo del estado
    const [administradores, setAdministradores] = useState<Administrador[]>([]);

    useEffect(() => {
        cargarAdministradores();
    }, []);

    const cargarAdministradores = async () => {
        try {
            const data = await getAdministradores();
            setAdministradores(data);
        } catch (error) {
            console.error('Error al cargar administradores:', error);
            toast.error('Error al cargar los administradores');
        }
    };

    const handleEliminar = async (dni: string) => {
        if (confirm('¿Estás seguro de eliminar este administrador?')) {
            try {
                await deleteAdministrador(dni);
                await cargarAdministradores();
                toast.success('Administrador eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
                toast.error('Error al eliminar el administrador');
            }
        }
    };

    const handleToggleEstado = async (dni: string) => {
        try {
            await toggleEstadoAdministrador(dni);
            await cargarAdministradores();
            toast.success('Estado del administrador actualizado exitosamente');
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            toast.error('Error al cambiar el estado del administrador');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left">DNI</th>
                        <th className="px-6 py-3 text-left">Nombres</th>
                        <th className="px-6 py-3 text-left">Categoría</th>
                        <th className="px-6 py-3 text-left">Estado</th>
                        <th className="px-6 py-3 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {administradores.map((admin: Administrador) => (
                        <tr key={admin.dni_admin}>
                            <td className="px-6 py-4">{admin.dni_admin}</td>
                            <td className="px-6 py-4">{admin.nombres}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    admin.categoria === 'super_admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {admin.categoria === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleToggleEstado(admin.dni_admin)}
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        admin.estado === 'activo'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {admin.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEditar(admin)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(admin.dni_admin)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaAdministradores;
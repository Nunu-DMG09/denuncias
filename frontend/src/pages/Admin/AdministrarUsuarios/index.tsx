import { useState } from 'react';
import TablaAdministradores from '../../../Components/Admin/Usuarios/TablaAdministradores';
import FormularioAdministrador from '../../../Components/Admin/Usuarios/FormularioAdministrador';
import useAdministrador from '../../../hooks/Admin/useAdministrador';

export interface Administrador {
    dni_admin: string;
    nombres: string;
    categoria: 'admin' | 'super_admin';
    estado: 'activo' | 'inactivo';
}

const AdministrarUsuarios = () => {
    // Utilizamos el hook useAdministrador
    const { loading, error } = useAdministrador();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [administradorEditar, setAdministradorEditar] = useState<Administrador | null>(null);
    
    // Si está cargando, mostramos un indicador
    if (loading) {
        return <div className="p-6">Cargando...</div>;
    }

    // Si hay un error, lo mostramos
    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Administrar Usuarios
                </h1>
                <button
                    onClick={() => {
                        setAdministradorEditar(null);
                        setMostrarFormulario(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Nuevo Administrador
                </button>
            </div>

            {mostrarFormulario ? (
                <FormularioAdministrador
                    administrador={administradorEditar}
                    onClose={() => {
                        setMostrarFormulario(false);
                        setAdministradorEditar(null);
                    }}
                />
            ) : (
                <TablaAdministradores
                onEditar={(administrador: Administrador) => {
                        setAdministradorEditar(administrador);
                        setMostrarFormulario(true);
                    }}
                />
            )}
        </div>
    );
};

export default AdministrarUsuarios;
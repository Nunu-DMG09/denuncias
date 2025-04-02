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
    const { loading, error } = useAdministrador();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [administradorEditar, setAdministradorEditar] = useState<Administrador | null>(null);
    
    if (loading) {
        return <div className="container mx-auto my-8 px-4">Cargando...</div>;
    }

    if (error) {
        return <div className="container mx-auto my-8 px-4 text-red-600">Error: {error}</div>;
    }
    
    return (
        <div className="container mx-auto my-8 px-4">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
                Gestión de Administradores
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6 backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {mostrarFormulario ? 
                            (administradorEditar ? 'Editar' : 'Nuevo') + ' Administrador' : 
                            'Administradores del Sistema'
                        }
                    </h3>
                    {!mostrarFormulario && (
                        <button
                            onClick={() => {
                                setAdministradorEditar(null);
                                setMostrarFormulario(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <span>+ Nuevo Administrador</span>
                        </button>
                    )}
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
        </div>
    );
};

export default AdministrarUsuarios;
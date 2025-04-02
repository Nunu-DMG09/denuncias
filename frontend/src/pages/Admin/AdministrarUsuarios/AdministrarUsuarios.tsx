import { useState, useEffect } from 'react';
import TablaAdministradores from '../../../Components/Admin/Usuarios/TablaAdministradores';
import FormularioAdministrador from '../../../Components/Admin/Usuarios/FormularioAdministrador';
import useAdministrador from '../../../hooks/Admin/useAdministrador';
import { AddIcon, AdminsIcon, BackIcon } from '../../../Components/Icons';

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
    const [animateContent, setAnimateContent] = useState(false);
    useEffect(() => {
        setAnimateContent(true);
    }, []);
    return (
        <div className="container mx-auto my-8 px-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
                    Gestión de Administradores
                </h2>
                <div className="mt-2 mx-auto w-24 h-1 bg-(--primary-color) rounded-full"></div>
            </div>
            <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 ${animateContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <span className="text-(--primary-color) mr-2">
                                <AdminsIcon />
                            </span>
                            {mostrarFormulario ? 
                                <span className="animate__animated animate__fadeIn">
                                    {administradorEditar ? 'Editar' : 'Nuevo'} Administrador
                                </span> : 
                                'Administradores del Sistema'
                            }
                        </h3>
                        <div className="flex space-x-3">
                            {mostrarFormulario && (
                                <button
                                    onClick={() => {
                                        setMostrarFormulario(false);
                                        setAdministradorEditar(null);
                                    }}
                                    className="border border-gray-300 bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <BackIcon />
                                    <span>Volver</span>
                                </button>
                            )}
                            {!mostrarFormulario && (
                                <button
                                    onClick={() => {
                                        setAdministradorEditar(null);
                                        setMostrarFormulario(true);
                                    }}
                                    className="bg-(--secondary-color) cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-(--primary-color) transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <AddIcon />
                                    <span>Nuevo</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {mostrarFormulario ? (
                        <div className="animate__animated animate__fadeIn">
                            <FormularioAdministrador
                                admin={administradorEditar}
                                onCancel={() => {
                                    setMostrarFormulario(false);
                                    setAdministradorEditar(null);
                                }}
                                
                            />
                        </div>
                    ) : (
                        <div className="animate__animated animate__fadeIn">
                            <TablaAdministradores
                                onEditar={(administrador: Administrador) => {
                                    setAdministradorEditar(administrador);
                                    setMostrarFormulario(true);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdministrarUsuarios;
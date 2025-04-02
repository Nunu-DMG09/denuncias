import React from 'react';
import { Administrador } from '../../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios';
import useAdministrador from '../../../hooks/Admin/useAdministrador';
import FormularioAdministrador from './FormularioAdministrador';
import { LoaderWifi } from "../../../Components/Loaders/LoaderWiFi";

interface TablaAdministradoresProps {
    onEditar: (admin: Administrador) => void;
}

const TablaAdministradores = ({ onEditar }: TablaAdministradoresProps) => {
    const { loading, administradores } = useAdministrador();
    
    // Estados para controlar la expansión de filas
    const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
    const [currentAction, setCurrentAction] = React.useState<'password' | 'state' | 'role' | null>(null);
    
    // Función para alternar la expansión
    const toggleExpand = (dni: string, action: 'password' | 'state' | 'role') => {
        if (expandedRow === dni && currentAction === action) {
            // Si ya está expandida con la misma acción, la cerramos
            setExpandedRow(null);
            setCurrentAction(null);
        } else {
            // Si no está expandida o es otra acción, la abrimos
            setExpandedRow(dni);
            setCurrentAction(action);
        }
    };
    
    // Handler para cuando se completa una acción
    const handleActionComplete = () => {
        setExpandedRow(null);
        setCurrentAction(null);
    };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <LoaderWifi />
                    <p className="ml-3 text-gray-600">Cargando administradores...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    DNI
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {administradores.map((admin) => (
                                <React.Fragment key={admin.dni_admin}>
                                    {/* Fila principal del administrador */}
                                    <tr className={`hover:bg-gray-50 ${expandedRow === admin.dni_admin ? 'bg-gray-50 border-b-0' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {admin.dni_admin}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {admin.nombres}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                admin.categoria === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {admin.categoria === 'super_admin' ? 'Super Admin' : 'Administrador'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                admin.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {admin.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Botón Contraseña */}
                                                <button
                                                    onClick={() => toggleExpand(admin.dni_admin, 'password')}
                                                    className="flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow group overflow-hidden"
                                                    aria-label="Cambiar contraseña"
                                                >
                                                    <span className="flex items-center justify-center w-9 h-9">
                                                        <i className="fas fa-key text-sm"></i>
                                                    </span>
                                                    <span className="pr-3 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
                                                        Contraseña
                                                    </span>
                                                </button>
                                                
                                                {/* Botón Estado */}
                                                <button
                                                    onClick={() => toggleExpand(admin.dni_admin, 'state')}
                                                    className={`flex items-center justify-center rounded-full transition-all duration-300 shadow-sm hover:shadow group overflow-hidden ${
                                                        admin.estado === 'activo' 
                                                            ? 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700' 
                                                            : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
                                                    }`}
                                                    aria-label="Cambiar estado"
                                                >
                                                    <span className="flex items-center justify-center w-9 h-9">
                                                        <i className={`fas ${admin.estado === 'activo' ? 'fa-toggle-on' : 'fa-toggle-off'} text-sm`}></i>
                                                    </span>
                                                    <span className="pr-3 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
                                                        {admin.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                    </span>
                                                </button>
                                                
                                                {/* Botón Categoría */}
                                                <button
                                                    onClick={() => toggleExpand(admin.dni_admin, 'role')}
                                                    className="flex items-center justify-center rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-300 shadow-sm hover:shadow group overflow-hidden"
                                                    aria-label="Cambiar categoría"
                                                >
                                                    <span className="flex items-center justify-center w-9 h-9">
                                                        <i className="fas fa-tags text-sm"></i>
                                                    </span>
                                                    <span className="pr-3 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
                                                        Categoría
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Fila expandible para edición */}
                                    {expandedRow === admin.dni_admin && currentAction && (
                                        <tr className="bg-gray-50 animate__animated animate__fadeIn">
                                            <td colSpan={5} className="px-0">
                                                <div className="border-t border-gray-200 border-dashed">
                                                    <FormularioAdministrador 
                                                        admin={admin}
                                                        actionType={currentAction}
                                                        onCancel={handleActionComplete}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            
                            {administradores.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No hay administradores registrados en el sistema
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default TablaAdministradores;

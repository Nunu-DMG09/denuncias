import React from 'react';
import useAdministrador from '../../../hooks/Admin/useAdministrador';
import FormularioAdministrador from './FormularioAdministrador';
import { LoaderWifi } from "../../../Components/Loaders/LoaderWiFi";
import { AdminRow } from './AdminRow';

const TablaAdministradores = () => {
    const { loading, administradores } = useAdministrador();
    const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
    const [currentAction, setCurrentAction] = React.useState<'password' | 'state' | 'role' | null>(null);
    const toggleExpand = (dni: string, action: 'password' | 'state' | 'role') => {
        if (expandedRow === dni && currentAction === action) {
            setExpandedRow(null);
            setCurrentAction(null);
        } else {
            setExpandedRow(dni);
            setCurrentAction(action);
        }
    };
    const handleActionComplete = () => {
        setExpandedRow(null);
        setCurrentAction(null);
    };
    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <LoaderWifi />
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
                                    <AdminRow 
                                        admin={admin} 
                                        expandedRow={expandedRow} 
                                        toggleExpand={toggleExpand}
                                    />
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

import { Outlet, NavLink } from "react-router";

export const UsersLayout = () => {
    return (
        <div className="container mx-auto my-8 px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Administradores</h2>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <NavLink 
                        to="/admin/users" 
                        end
                        className={({ isActive }) => 
                            `py-4 px-1 border-b-2 text-sm font-medium ${
                                isActive 
                                ? "border-(--primary-color) text-(--primary-color)" 
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`
                        }
                    >
                        Administradores
                    </NavLink>
                    <NavLink 
                        to="/admin/users/search" 
                        className={({ isActive }) => 
                            `py-4 px-1 border-b-2 text-sm font-medium ${
                                isActive 
                                ? "border-(--primary-color) text-(--primary-color)" 
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`
                        }
                    >
                        Buscar Admin.
                    </NavLink>

                </nav>
            </div>
            <Outlet />
        </div>
    );
};
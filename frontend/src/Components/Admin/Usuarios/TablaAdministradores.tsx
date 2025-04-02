import useAdministrador from "../../../hooks/Admin/useAdministrador";
import { Administrador } from "../../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios";
import { LoaderWifi } from "../../../Components/Loaders/LoaderWiFi";
import { getEstadoColor, getTypeColor } from "../../../utils";

interface TablaAdministradoresProps {
	onEditar: (administrador: Administrador) => void;
}

const TablaAdministradores = ({ onEditar }: TablaAdministradoresProps) => {
	const {
		loading,
        administradores
	} = useAdministrador();
	return (
		<>
			{loading ? (
				<div className="flex justify-center items-center h-full py-10">
					<LoaderWifi />
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 bg-(--primary-color) rounded-lg">
						<thead>
							<tr className="bg-[#3a46500d]">
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									DNI
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Nombres
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Categoría
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Estado
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{administradores.map((admin: Administrador) => (
								<tr
									key={admin.dni_admin}
									className="hover:bg-gray-50"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{admin.dni_admin}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{admin.nombres}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
												admin.categoria
											)}`}
										>
											{admin.categoria.replace("_", " ")}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
												admin.estado
											)}`}
										>
											{admin.estado}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<div className="flex flex-wrap items-center gap-2">
											{/* Botón Contraseña */}
											<div className="group relative">
												<button
													onClick={() => onEditar(admin)}
													className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow"
													aria-label="Cambiar contraseña"
												>
													<i className="fas fa-key text-sm"></i>
												</button>
												<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
													<div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
														Cambiar contraseña
														<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
													</div>
												</div>
											</div>
											
											{/* Botón Estado */}
											<div className="group relative">
												<button
													// onClick={() => handleToggleEstado(admin.dni_admin)}
													className={`cursor-pointer flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 shadow-sm hover:shadow ${
														admin.estado === 'activo' 
															? 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700' 
															: 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
													}`}
													aria-label="Cambiar estado"
												>
													<i className={`fas ${admin.estado === 'activo' ? 'fa-toggle-on' : 'fa-toggle-off'} text-sm`}></i>
												</button>
												<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
													<div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
														{admin.estado === 'activo' ? 'Desactivar' : 'Activar'} usuario
														<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
													</div>
												</div>
											</div>
											
											{/* Botón Categoría */}
											<div className="group relative">
												<button
													onClick={() => console.log("Editar categoría")}
													className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow"
													aria-label="Cambiar categoría"
												>
													<i className="fas fa-tags text-sm"></i>
												</button>
												<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block">
													<div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
														Cambiar categoría
														<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default TablaAdministradores;

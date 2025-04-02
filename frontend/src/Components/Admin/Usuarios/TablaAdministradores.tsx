// frontend/src/components/Admin/Usuarios/TablaAdministradores.tsx
import { useEffect, useState } from "react";
import useAdministrador from "../../../hooks/Admin/useAdministrador";
import { toast } from "sonner";
import { Administrador } from "../../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios";
import { LoaderWifi } from "../../../Components/Loaders/LoaderWiFi";

interface TablaAdministradoresProps {
	onEditar: (administrador: Administrador) => void;
}

const TablaAdministradores = ({ onEditar }: TablaAdministradoresProps) => {
	const {
		getAdministradores,
		deleteAdministrador,
		toggleEstadoAdministrador,
		loading,
	} = useAdministrador();

	const [administradores, setAdministradores] = useState<Administrador[]>([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [adminToDelete, setAdminToDelete] = useState<Administrador | null>(
		null
	);

	useEffect(() => {
		cargarAdministradores();
	}, []);

	const cargarAdministradores = async () => {
		try {
			const data = await getAdministradores();
			setAdministradores(data);
		} catch (error) {
			console.error("Error al cargar administradores:", error);
			toast.error("Error al cargar los administradores");
		}
	};

	const handleEliminarClick = (admin: Administrador) => {
		setAdminToDelete(admin);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!adminToDelete) return;

		try {
			await deleteAdministrador(adminToDelete.dni_admin);
			await cargarAdministradores();
			setShowDeleteModal(false);
			setAdminToDelete(null);
		} catch (error) {
			console.error("Error al eliminar:", error);
			toast.error("Error al eliminar el administrador");
		}
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
		setAdminToDelete(null);
	};

	const handleToggleEstado = async (dni: string) => {
		try {
			await toggleEstadoAdministrador(dni);
			await cargarAdministradores();
			toast.success("Estado del administrador actualizado exitosamente");
		} catch (error) {
			console.error("Error al cambiar estado:", error);
			toast.error("Error al cambiar el estado del administrador");
		}
	};
	return (
		<>
			{loading ? (
				<div className="flex justify-center items-center h-full py-10">
					<LoaderWifi />
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr className="bg-[#3a46500d]">
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									DNI
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Nombres
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Categoría
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Estado
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												admin.categoria ===
												"super_admin"
													? "bg-purple-100 text-purple-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{admin.categoria === "super_admin"
												? "Super Admin"
												: "Admin"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() =>
												handleToggleEstado(
													admin.dni_admin
												)
											}
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												admin.estado === "activo"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{admin.estado === "activo"
												? "Activo"
												: "Inactivo"}
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<div className="flex space-x-3">
											<button
												onClick={() => onEditar(admin)}
												className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
											>
												Editar
											</button>
											<button
												onClick={() =>
													handleEliminarClick(admin)
												}
												className="text-red-600 hover:text-red-900 transition-colors duration-200"
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
			)}
			{showDeleteModal && (
				<div className="fixed inset-0 backdrop-blur-[2px] bg-slate-400/20 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
						<div className="flex items-center justify-center mb-4">
							<svg
								className="w-12 h-12 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-center mb-4">
							Confirmar Eliminación
						</h3>
						<p className="text-gray-600 text-center mb-6">
							¿Estás seguro de que deseas eliminar al
							administrador{" "}
							<span className="font-semibold">
								{adminToDelete?.nombres}
							</span>
							?
							<br />
							<span className="text-sm text-gray-500">
								Esta acción no se puede deshacer.
							</span>
						</p>
						<div className="flex justify-end space-x-3">
							<button
								onClick={handleCancelDelete}
								className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
							>
								Cancelar
							</button>
							<button
								onClick={handleConfirmDelete}
								className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default TablaAdministradores;

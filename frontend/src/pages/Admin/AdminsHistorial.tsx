import { useAdminHistorial } from "../../hooks/Admin/useAdminHistorial";
import { LoaderWifi } from "../../Components/Loaders/LoaderWiFi";
import {
	formatDateComplete,
	getActionBadgeColor,
	getActionName,
	getTypeColor,
} from "../../utils";

export const AdminsHistorial = () => {
	const {
		historialPaginado,
		loading,
		error,
		refetch,
		currentPage,
		totalPages,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
	} = useAdminHistorial(10); // 10 items por página

	return (
		<div className="container mx-auto my-8 px-4">
			<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 animate__animated animate__fadeIn">
				<div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<h3 className="text-xl font-semibold text-gray-800 flex items-center">
							<span className="text-(--primary-color) mr-2">
								<i className="fas fa-history"></i>
							</span>
							<span className="animate__animated animate__fadeIn">
								Historial de Administradores
							</span>
						</h3>
						<button
							onClick={() => refetch()}
							className="bg-(--secondary-color) cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-(--primary-color) transition-colors duration-200 flex items-center space-x-2"
							disabled={loading}
						>
							<i
								className={`fas fa-sync-alt ${
									loading ? "animate-spin" : ""
								}`}
							></i>
							<span>Actualizar</span>
						</button>
					</div>
				</div>
				<div className="p-6">
					{loading && (
						<div className="flex justify-center items-center py-8">
							<LoaderWifi />
						</div>
					)}
					{error && !loading && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
							<div className="flex items-start">
								<i className="fas fa-exclamation-circle text-red-500 mt-0.5 mr-2"></i>
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					)}
					{!loading && !error && historialPaginado.length > 0 && (
						<>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
									<thead className="bg-(--primary-color) text-white">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
											>
												Afectado
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
											>
												Acción
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
											>
												Realizada por
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
											>
												Motivo
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
											>
												Fecha
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{historialPaginado.map((item) => (
											<tr
												key={item.id}
												className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{item.admin_nombre ||
														"Nombre no disponible"}
													<span
														className={`px-2 ml-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
															item.admin_categoria ||
																"default"
														)}`}
													>
														{item.admin_categoria ===
														"admin"
															? "Administrador"
															: item.admin_categoria ===
															  "super_admin"
															? "Super Admin."
															: "-"}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(
															item.accion
														)}`}
													>
														{getActionName(
															item.accion ||
																"No Proporcionado"
														)}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{item.realizado_por}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{item.motivo}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
													{formatDateComplete(
														item.fecha_accion
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{totalPages > 1 && (
								<div className="flex justify-center mt-6">
									<nav
										className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
										aria-label="Paginación"
									>
										<button
											onClick={() =>
												handleCurrentPage("prev")
											}
											disabled={currentPage === 1}
											className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
												currentPage === 1
													? "bg-gray-100 text-gray-400 cursor-not-allowed"
													: "bg-white text-gray-500 hover:bg-gray-50"
											}`}
										>
											<span className="sr-only">
												Anterior
											</span>
											<i className="fas fa-chevron-left text-xs"></i>
										</button>

										{getVisiblePageNumbers().map((page) => (
											<button
												key={page}
												onClick={() =>
													handlePageChange(page)
												}
												className={`relative inline-flex items-center px-4 py-2 border ${
													currentPage === page
														? "z-10 bg-(--primary-color) border-(--primary-color) text-white"
														: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
												}`}
											>
												{page}
											</button>
										))}

										<button
											onClick={() =>
												handleCurrentPage("next")
											}
											disabled={
												currentPage === totalPages
											}
											className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
												currentPage === totalPages
													? "bg-gray-100 text-gray-400 cursor-not-allowed"
													: "bg-white text-gray-500 hover:bg-gray-50"
											}`}
										>
											<span className="sr-only">
												Siguiente
											</span>
											<i className="fas fa-chevron-right text-xs"></i>
										</button>
									</nav>
								</div>
							)}
						</>
					)}
					{!loading && !error && historialPaginado.length === 0 && (
						<div className="text-center py-16 bg-gray-50 rounded-lg">
							<div className="text-5xl text-gray-300 mb-3">
								<i className="fas fa-history"></i>
							</div>
							<h3 className="text-lg font-medium text-gray-700 mb-1">
								No hay registros en el historial
							</h3>
							<p className="text-sm text-gray-500">
								Aún no se han realizado acciones de
								administración
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default AdminsHistorial;
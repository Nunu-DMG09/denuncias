import { useAdminDenunciasRecibidas } from "../../hooks/Admin/Denuncias/useAdminDenunciasRecibidas";
import { getStatusColor } from "../../utils";

export const DenunciasRecibidas = () => {
	const itemsPerPage = 10;
	const {
		loading,
		denunciasPaginadas,
		totalPages,
		currentPage,
		handleCurrentPage,
		getVisiblePageNumbers,
		handlePageChange,
	} = useAdminDenunciasRecibidas(itemsPerPage);

	return (
		<div className="container mx-auto my-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Denuncias Recibidas
				</h2>
				{denunciasPaginadas.length > 0 && (
					<div className="text-sm text-gray-600">
						Mostrando {denunciasPaginadas.length} de{" "}
						{denunciasPaginadas.length} denuncias
					</div>
				)}
			</div>
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--primary-color)"></div>
				</div>
			) : denunciasPaginadas.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
					<div className="text-center">
						<svg
							className="mx-auto h-16 w-16 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<h3 className="mt-2 text-lg font-medium text-gray-900">
							No tienes denuncias asignadas
						</h3>
						<p className="mt-1 text-base text-gray-500">
							No se encontraron denuncias asignadas a tu cuenta.
						</p>
					</div>
				</div>
			) : (
				<>
					<div className="overflow-x-auto bg-white rounded-lg shadow">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-(--primary-color) bg-opacity-10">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Código
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Motivo
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Fecha
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Estado
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Denunciante
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Acción
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{denunciasPaginadas.map((denuncia) => (
									<tr
										key={denuncia.tracking_code}
										className="hover:bg-gray-50 transition duration-150"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{denuncia.tracking_code}
										</td>
										<td className="px-6 py-4">
											<div className="text-sm font-medium text-gray-900">
												{denuncia.motivo}
											</div>
											<div className="text-sm text-gray-500 truncate max-w-xs">
												Contra:{" "}
												{denuncia.denunciado_nombre}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{new Date(
												denuncia.fecha_registro
											).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
													denuncia.estado
												)}`}
											>
												{denuncia.estado.replace(
													"_",
													" "
												)}
											</span>
										</td>
										<td className="px-6 capitalize py-4 whitespace-nowrap text-sm text-gray-500">
											{denuncia.denunciante_nombre}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex space-x-2">
												<button
													onClick={() => {
														/* Implementar ver detalles */
													}}
													className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-100 transition duration-300 ease-in-out flex items-center"
												>
													<i className="fas fa-eye mr-1.5"></i>
													Detalles
												</button>
												<button
													onClick={() => {
														/* Implementar edición */
													}}
													className="bg-(--secondary-color) cursor-pointer text-white px-3 py-1.5 rounded hover:bg-(--primary-color) transition duration-300 ease-in-out flex items-center"
												>
													<i className="fas fa-edit mr-1.5"></i>
													Editar
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="flex justify-between items-center mt-6">
						<div className="text-sm text-gray-600">
							Página {currentPage} de {totalPages}
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => handleCurrentPage("prev")}
								disabled={currentPage === 1}
								className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Anterior
							</button>
							<div className="hidden sm:flex space-x-1">
								{getVisiblePageNumbers().map((pageNum) => (
									<button
										key={pageNum}
										onClick={() =>
											handlePageChange(pageNum)
										}
										className={`px-3 py-2 border rounded-md text-sm font-medium ${
											pageNum === currentPage
												? "bg-(--primary-color) text-white border-(--primary-color)"
												: "text-gray-700 border-gray-300 hover:bg-gray-50"
										}`}
									>
										{pageNum}
									</button>
								))}
							</div>
							<button
								onClick={() => handleCurrentPage("next")}
								disabled={currentPage === totalPages}
								className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Siguiente
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

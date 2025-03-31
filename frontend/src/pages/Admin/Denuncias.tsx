import { useAdminDenuncias } from "../../hooks/Admin/Denuncias/useAdminDenuncias";
import { getStatusColor } from "../../utils";
import { useAuthContext } from "../../hooks/Admin/useAuthContext";
import { DenunciasWarn } from "../../Components/Errors/DenunciasWarn";
import { DenunciasLoader } from "../../Components/Loaders/DenunciasLoader";

export const Denuncias = () => {
	const itemsPerPage = 10;
	const {
		loading,
		denunciasPaginadas,
		totalPages,
		currentPage,
		handleCurrentPage,
		getVisiblePageNumbers,
		handlePageChange,
		recibirDenuncia
	} = useAdminDenuncias(itemsPerPage);
	const { user } = useAuthContext();
	return (
		<div className="container mx-auto my-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Denuncias Disponibles
				</h2>
				{denunciasPaginadas.length > 0 && (
					<div className="text-sm text-gray-600">
						Mostrando {denunciasPaginadas.length} de{" "}
						{denunciasPaginadas.length} denuncias
					</div>
				)}
			</div>

			{loading ? (
				<DenunciasLoader />
			) : denunciasPaginadas.length === 0 ? (
				<DenunciasWarn />
			) : (
				<>
					<div className="overflow-x-auto bg-white rounded-lg shadow">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-(--primary-color) text-white">
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
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
											<button
												onClick={() =>
													recibirDenuncia( user?.dni_admin || '',denuncia.tracking_code)}
												className="bg-(--secondary-color) cursor-pointer text-white px-3 py-1.5 rounded hover:bg-(--primary-color) transition duration-300 ease-in-out flex items-center"
											>
												<i className="fas fa-plus mr-1.5"></i>
												Recibir
											</button>
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

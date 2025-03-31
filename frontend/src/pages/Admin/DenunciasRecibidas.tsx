import React from "react";
import { ExpandedRecievedRow } from "../../Components/Admin/ExpandedRecievedRow";
import { RecievedRows } from "../../Components/Admin/RecievedRows";
import { DocumentIcon } from "../../Components/Icons";
import { useAdminDenunciasRecibidas } from "../../hooks/Admin/Denuncias/useAdminDenunciasRecibidas";
import { DenunciasLoader } from "../../Components/Loaders/DenunciasLoader";

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
		expandedRows,
		toggleRowExpansion,
		handleEdit,
		editingRows,
		handleCommentChange,
		commentInputs,
		handleStateChange,
		stateRows
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
				<DenunciasLoader />
			) : denunciasPaginadas.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
					<div className="text-center">
						<DocumentIcon />
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
										className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Acción
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{denunciasPaginadas.map((denuncia) => (
									<React.Fragment key={denuncia.tracking_code}>
										<RecievedRows
											denuncia={denuncia}
											isExpanded={!!expandedRows[denuncia.tracking_code]}
											onToggle={toggleRowExpansion}
										/>
										{expandedRows[
											denuncia.tracking_code
										] && (
											<ExpandedRecievedRow
												key={`details-${denuncia.tracking_code}`}
												denuncia={denuncia}
												onClose={toggleRowExpansion}
												onEdit={handleEdit}
												isEditing={!!editingRows[denuncia.tracking_code]}
												commentValue = {commentInputs[denuncia.tracking_code]}
												onCommentChange={handleCommentChange}
												onStateChange={handleStateChange}
												stateValue={stateRows[denuncia.tracking_code]}
											/>
										)}
									</React.Fragment>
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

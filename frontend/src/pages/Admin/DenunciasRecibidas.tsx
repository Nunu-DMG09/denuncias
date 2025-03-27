import { useAdminDenunciasRecibidas } from "../../hooks/Admin/Denuncias/useAdminDenunciasRecibidas";

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
            
        </div>
    );
}
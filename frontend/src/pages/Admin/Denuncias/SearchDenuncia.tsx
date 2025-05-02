import { useSearchDenuncia } from "../../../hooks/Admin/Denuncias/useSearchDenuncia";
import { FiltersIcon, InfoIcon } from "../../../Components/Icons";
import { SearchForm } from "../../../Components/Admin/Search/SearchForm";
import { Filters } from "../../../Components/Admin/Search/Filters";
import { DenunciaCard } from "../../../Components/Admin/Search/DenunciaCard";
export const SearchDenuncia = () => {
	const {
		numeroDocumento,
		tipoDocumento,
		handleDocumentoChange,
		handleName,
		nombre,
		handleTipoDocumento,
		error,
		isLoading,
		denunciaData,
		handleSearchClick,
		hasSearched,
		isLoadingDNI,
		expandedCards,
		toggleCardDetails,
		handleShowFilters,
		showFilters,
		motivos,
		fechaFilter,
		handleFechaFilterChange,
		motivoFilter,
		handleMotivoFIlterChange,
		estadoFilter,
		handleEstadoFilterChange,
		denunciasFiltradasData,
		applyFilters,
		clearFilters,
		filtered,
	} = useSearchDenuncia();
	return (
		<div className="container mx-auto my-8 px-4">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Buscar denuncia
			</h2>
			<SearchForm
				numeroDocumento={numeroDocumento}
				tipoDocumento={tipoDocumento}
				handleDocumentoChange={handleDocumentoChange}
				handleTipoDocumento={handleTipoDocumento}
				handleName={handleName}
				nombre={nombre}
				isLoading={isLoading}
				isLoadingDNI={isLoadingDNI}
				error={error}
				handleSearchClick={handleSearchClick}
			/>
			{hasSearched && (
				<div className="mt-10 animate__animated animate__fadeIn max-w-3xl mx-auto">
					<div className="w-full bg-(--tertiary-color) mb-4 border-b border-(--primary-color) flex justify-between items-center p-4 rounded-md shadow-sm">
						<h3 className="text-lg font-semibold text-white">
							{denunciaData.length > 0 && !filtered
								? `Resultados de la búsqueda (${denunciaData.length})`
								: denunciasFiltradasData.length > 0 && filtered
								? `Resultados de la búsqueda (${denunciasFiltradasData.length})`
								: "No se encontraron resultados"}
						</h3>
						<button
							onClick={handleShowFilters}
							className={`${
								showFilters ? "bg-blue-700" : "bg-slate-700"
							} text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900 cursor-pointer transition-all duration-300 flex items-center space-x-2`}
						>
							<FiltersIcon />
							<span>Filtros</span>
						</button>
					</div>
					{denunciaData.length > 0 ? (
						<div className="flex flex-col md:flex-row gap-4">
							<div className={`w-full ${showFilters ? "md:w-3/4" : "md:w-full"} transition-all duration-300 ease-in-out`}>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
									{(filtered
										? denunciasFiltradasData
										: denunciaData
									).map((denuncia) => (
										<DenunciaCard
											key={denuncia.id}
											denuncia={denuncia}
											nombre={nombre}
											numeroDocumento={numeroDocumento}
											toggleCardDetails={
												toggleCardDetails
											}
											expandedCards={expandedCards}
										/>
									))}
								</div>
							</div>
							<div
								className={`w-full md:w-1/4 transition-all duration-300 ${
									showFilters
										? "opacity-100 max-h-[2000px]"
										: "opacity-0 max-h-0 md:hidden overflow-hidden"
								}`}
							>
								<Filters
									fechaFilter={fechaFilter}
									motivoFilter={motivoFilter}
									estadoFilter={estadoFilter}
									handleFechaFilterChange={
										handleFechaFilterChange
									}
									handleMotivoFIlterChange={
										handleMotivoFIlterChange
									}
									handleEstadoFilterChange={
										handleEstadoFilterChange
									}
									applyFilters={applyFilters}
									clearFilters={clearFilters}
									motivos={motivos}
								/>
							</div>
						</div>
					) : (
						<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
							<div className="flex items-center">
								<div className="flex-shrink-0 text-blue-400">
									<InfoIcon />
								</div>
								<div className="ml-3">
									<p className="text-sm text-blue-700">
										Intente buscar con otros criterios o
										revisar que los datos ingresados sean
										correctos.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
export default SearchDenuncia;
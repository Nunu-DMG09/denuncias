import { useSearchDenuncia } from "../../hooks/Admin/Denuncias/useSearchDenuncia";
import {
	CalendarIcon,
	CheckIcon,
	FiltersIcon,
	MiniDocumentIcon,
	ResetIcon,
} from "../../Components/Icons";
import { getStatusColor } from "../../utils";
import { SearchForm } from "../../Components/Admin/Search/SearchForm";
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
							<div
								className={`w-full ${
									showFilters ? "md:w-3/4" : "md:w-full"
								} transition-all duration-300 ease-in-out`}
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
									{(filtered
										? denunciasFiltradasData
										: denunciaData
									).map((denuncia) => (
										<div
											key={denuncia.id}
											className="bg-white rounded-xl relative shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
											style={{
												height: "auto",
												alignSelf: "start",
											}}
										>
											<div className="p-5 flex-grow flex flex-col">
												<div className="flex justify-between items-start mb-3 flex-wrap">
													<h4 className="text-lg font-medium text-gray-800 flex items-center">
														<MiniDocumentIcon />
														<span className="font-semibold tracking-wide">
															{
																denuncia.tracking_code
															}
														</span>
													</h4>
													<span
														className={`px-3 py-1 text-xs rounded-full capitalize font-semibold ${getStatusColor(
															denuncia.estado
														)}`}
													>
														{denuncia.estado.replace(
															"_",
															" "
														)}
													</span>
												</div>
												<div
													className="space-y-2 flex-grow"
													style={{
														minHeight: 120,
													}}
												>
													<div className="flex items-center text-sm text-gray-500">
														<span className="text-indigo-600">
															<CalendarIcon />
														</span>
														{new Date(
															denuncia.fecha_registro
														).toLocaleDateString(
															"es-ES",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															}
														)}
													</div>
													<div className="mt-2">
														<span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md">
															{denuncia.motivo_id ===
															"mo_otros"
																? denuncia.motivo_otro
																: denuncia.motivo}
														</span>
													</div>

													<div
														className={`mt-3 text-sm text-gray-600 ${
															!expandedCards[
																denuncia.id
															] &&
															"line-clamp-2"
														}`}
													>
														<p>
															{
																denuncia.descripcion
															}
														</p>
													</div>
												</div>
												<div
													className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
														expandedCards[
															denuncia.id
														]
															? "max-h-96 opacity-100"
															: "max-h-0 opacity-0"
													}`}
												>
													<div className="pt-4 border-t border-gray-100">
														<div className="space-y-4">
															<div>
																<h5 className="text-sm font-medium text-gray-700 mb-1">
																	Información
																	del
																	denunciante
																</h5>
																<p className="text-sm text-gray-600">
																	{denuncia.denunciante_nombre ||
																		"Información no disponible"}
																	{denuncia.denunciante_dni &&
																		` - ${denuncia.denunciante_dni}`}
																</p>
															</div>
															<div>
																<h5 className="text-sm font-medium text-gray-700 mb-1">
																	Información
																	del
																	denunciado
																</h5>
																<p className="text-sm text-gray-600">
																	{nombre ||
																		"Información no disponible"}
																	{numeroDocumento &&
																		` - ${numeroDocumento}`}
																</p>
															</div>
															{denuncia.seguimiento_comentario && (
																<div>
																	<h5 className="text-sm font-medium text-gray-700 mb-1">
																		Comentarios
																		de
																		seguimiento
																	</h5>
																	<p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md italic">
																		{
																			denuncia.seguimiento_comentario
																		}
																	</p>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
											<div className="mt-auto border-t border-gray-100 bg-gray-50 px-5 py-3">
												<button
													className="w-full cursor-pointer text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
													onClick={() =>
														toggleCardDetails(
															denuncia.id
														)
													}
												>
													{expandedCards[
														denuncia.id
													] ? (
														<>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 mr-1"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={
																		2
																	}
																	d="M5 15l7-7 7 7"
																/>
															</svg>
															Ocultar detalles
														</>
													) : (
														<>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-4 w-4 mr-1"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={
																		2
																	}
																	d="M19 9l-7 7-7-7"
																/>
															</svg>
															Ver detalles
														</>
													)}
												</button>
											</div>
										</div>
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
								<div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sticky top-4">
									<h3 className="text-lg font-medium text-gray-800 mb-5 flex items-center border-b pb-2">
										Filtrar resultados
									</h3>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Fecha de denuncia
											</label>
											<div className="space-y-2">
												<input
													type="date"
													className="w-full outline-none p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
													value={fechaFilter}
													onChange={
														handleFechaFilterChange
													}
												/>
											</div>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Motivo de denuncia
											</label>
											<select
												className="w-full outline-none p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
												value={motivoFilter}
												onChange={
													handleMotivoFIlterChange
												}
											>
												<option value="">
													Seleccione un motivo
												</option>
												{motivos.map((motivo) => (
													<option
														key={motivo.id}
														value={motivo.id}
													>
														{motivo.nombre}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Estado de denuncia
											</label>
											<div className="space-y-1">
												<label className="flex cursor-pointer items-center text-sm">
													<input
														type="checkbox"
														className="form-checkbox h-4 w-4 text-indigo-600"
														checked={
															estadoFilter.registrado
														}
														onChange={(e) => {
															handleEstadoFilterChange(
																"registrado",
																e.target
																	.checked
															);
														}}
													/>
													<span className="ml-2">
														Registrada
													</span>
												</label>
												<label className="flex cursor-pointer items-center text-sm">
													<input
														type="checkbox"
														className="form-checkbox h-4 w-4 text-indigo-600"
														checked={
															estadoFilter.recibida
														}
														onChange={(e) => {
															handleEstadoFilterChange(
																"recibida",
																e.target
																	.checked
															);
														}}
													/>
													<span className="ml-2">
														Recibida
													</span>
												</label>
												<label className="flex cursor-pointer items-center text-sm">
													<input
														type="checkbox"
														className="form-checkbox h-4 w-4 text-indigo-600"
														checked={
															estadoFilter.en_proceso
														}
														onChange={(e) => {
															handleEstadoFilterChange(
																"en_proceso",
																e.target
																	.checked
															);
														}}
													/>
													<span className="ml-2">
														En proceso
													</span>
												</label>
												<label className="flex cursor-pointer items-center text-sm">
													<input
														type="checkbox"
														className="form-checkbox h-4 w-4 text-indigo-600"
														checked={
															estadoFilter.resuelto
														}
														onChange={(e) => {
															handleEstadoFilterChange(
																"resuelto",
																e.target
																	.checked
															);
														}}
													/>
													<span className="ml-2">
														Resuelto
													</span>
												</label>
												<label className="flex cursor-pointer items-center text-sm">
													<input
														type="checkbox"
														className="form-checkbox h-4 w-4 text-indigo-600"
														checked={
															estadoFilter.rechazado
														}
														onChange={(e) => {
															handleEstadoFilterChange(
																"rechazado",
																e.target
																	.checked
															);
														}}
													/>
													<span className="ml-2">
														Rechazado
													</span>
												</label>
											</div>
										</div>
										<div className="pt-4 border-t">
											<button
												className="w-full cursor-pointer bg-(--primary-color) text-white py-2 px-4 rounded hover:bg-(--secondary-color) transition-all duration-300 flex items-center justify-center"
												onClick={applyFilters}
											>
												<CheckIcon />
												Aplicar filtros
											</button>
											<button
												className="w-full cursor-pointer mt-2 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
												onClick={clearFilters}
											>
												<ResetIcon />
												Limpiar filtros
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
							<div className="flex items-center">
								<div className="flex-shrink-0 text-blue-400">
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-blue-700">
										Intente buscar con otros criterios o
										revisar que los datos ingresados
										sean correctos.
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

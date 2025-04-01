import { toast } from "sonner";
import { Loader } from "../../Components/Loaders/Loader";
import { useSearchDenuncia } from "../../hooks/Admin/Denuncias/useSearchDenuncia";
import { CalendarIcon, MiniDocumentIcon } from "../../Components/Icons";
import { getStatusColor } from "../../utils";
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
		toggleCardDetails
	} = useSearchDenuncia();
	return (
		<div className="container mx-auto my-8 px-4">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Buscar denuncia
			</h2>
			<div className="space-y-8 max-w-3xl my-0 mx-auto">
				<div className="space-y-2">
					<label className="mb-2" htmlFor="tipo-documento">
						Tipo de Documento de Identidad del Denunciado
						<span className="text-red-500 font-black text-xl">
							*
						</span>
					</label>
					<select
						name="tipo-documento"
						id="tipo-documento"
						value={tipoDocumento}
						onChange={(e) => handleTipoDocumento(e.target.value)}
						className="w-full cursor-pointer p-[1em] border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent text-(--secondary-color) focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out"
					>
						<option
							value=""
							disabled
							className="text-(--gray-light)"
						>
							Seleccione una opción
						</option>
						<option value="dni">DNI</option>
						<option value="ruc">RUC</option>
						<option value="carnet-extranjeria">
							Carnet de Extranjería
						</option>
					</select>
				</div>
				<div className="space-y-2 relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={numeroDocumento}
						onChange={handleDocumentoChange}
						minLength={tipoDocumento === "dni" ? 8 : 11}
						maxLength={
							tipoDocumento === "dni"
								? 8
								: tipoDocumento === "ruc"
								? 11
								: 20
						}
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Nro de Documento de Identidad
						<span className="text-red-500 font-black">*</span>
					</label>
					{isLoadingDNI && <Loader isBtn={false} />}
				</div>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				{tipoDocumento !== "dni" && tipoDocumento !== "ruc" ? (
					""
				) : (
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							value={nombre}
							disabled={isLoading}
							readOnly={
								tipoDocumento === "dni" ||
								tipoDocumento === "ruc" ||
								tipoDocumento === ""
							}
							onChange={
								tipoDocumento === "dni" ||
								tipoDocumento === "ruc" ||
								tipoDocumento === ""
									? undefined
									: handleName
							}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Nombre del Denunciado
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
					</div>
				)}
				<div className="flex justify-center md:justify-end items-center">
					<button onClick={handleSearchClick} className="bg-(--primary-color) cursor-pointer text-white px-4 py-2 rounded hover:bg-(--secondary-color) transition duration-300 ease-in-out flex items-center">
						{isLoading ? (
							<Loader isBtn={true} />
						) : (
							<>
								<i className="fas fa-search mr-2"></i>
								Buscar
							</>
						)}
					</button>
				</div>
				{hasSearched && (
					<div className="mt-10 animate__animated animate__fadeIn">
						<h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
							{denunciaData.length > 0 
								? `Resultados de la búsqueda (${denunciaData.length})`
								: "No se encontraron denuncias con estos criterios"}
						</h3>
						
						{denunciaData.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{denunciaData.map((denuncia) => (
									<div 
										key={denuncia.id} 
										className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
									>
										<div className="p-5">
											<div className="flex justify-between items-start mb-3 flex-wrap">
												<h4 className="text-lg font-medium text-gray-800 flex items-center">
													<MiniDocumentIcon />
													<span className="font-semibold tracking-wide">{denuncia.tracking_code}</span>
												</h4>
												<span 
													className={`px-3 py-1 text-xs rounded-full capitalize font-semibold ${getStatusColor(denuncia.estado)}`}
												>
													{denuncia.estado.replace("_", " ")}
												</span>
											</div>
											<div className="space-y-2">
												<div className="flex items-center text-sm text-gray-500">
													<span className="text-indigo-600">
														<CalendarIcon />
													</span>
													{new Date(denuncia.fecha_registro).toLocaleDateString('es-ES', {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})}
												</div>
												
												<div className="mt-2">
													<span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md">
														{denuncia.motivo_id === 'mo_otros' ? denuncia.motivo_otro : denuncia.motivo}
													</span>
												</div>
												<div className={`mt-3 text-sm text-gray-600 ${!expandedCards[denuncia.id] && 'line-clamp-2'}`}>
													<p>{denuncia.descripcion}</p>
												</div>
											</div>
											<div 
												className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
													expandedCards[denuncia.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
												}`}
											>
												<div className="pt-4 border-t border-gray-100">
													<div className="space-y-4">
														<div>
															<h5 className="text-sm font-medium text-gray-700 mb-1">Información del denunciante</h5>
															<p className="text-sm text-gray-600">
																{denuncia.denunciante_nombre || "Información no disponible"}
																{denuncia.denunciante_dni && ` - ${denuncia.denunciante_dni}`}
															</p>
														</div>
														
														<div>
															<h5 className="text-sm font-medium text-gray-700 mb-1">Información del denunciado</h5>
															<p className="text-sm text-gray-600">
																{denuncia.denunciado_nombre || "Información no disponible"}
																{denuncia.denunciado_dni && ` - ${denuncia.denunciado_dni}`}
															</p>
														</div>
														
														{denuncia.seguimiento_comentario && (
															<div>
																<h5 className="text-sm font-medium text-gray-700 mb-1">Comentarios de seguimiento</h5>
																<p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md italic">
																	{denuncia.seguimiento_comentario}
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
										<div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
											<button 
												className="w-full cursor-pointer text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
												onClick={() => toggleCardDetails(denuncia.id)}
											>
												{expandedCards[denuncia.id] ? (
													<>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
														</svg>
														Ocultar detalles
													</>
												) : (
													<>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
														</svg>
														Ver detalles
													</>
												)}
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
								<div className="flex items-center">
									<div className="flex-shrink-0 text-blue-400">
										<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm text-blue-700">
											Intente buscar con otros criterios o revisar que los datos ingresados sean correctos.
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

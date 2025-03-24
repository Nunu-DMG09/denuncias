import { useTracking } from "../../hooks/useTracking";
import { LoaderWifi } from "../../Components/Loaders/LoaderWiFi";
import { ErrorIcon } from "../../Components/Icons";
export const TrackingDenuncia = () => {
	const {
		trackingCode,
		handleInputChange,
		handleSubmit,
		trackingData,
		trackingLoading,
		trackingError,
		getStatusColor,
		getStatusIcon,
		formatDate,
	} = useTracking();
	return (
		<div className="container mx-auto px-4 py-6 max-w-3xl">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
				Seguimiento de Denuncia
			</h2>
			<form
				className="rounded-lg p-6 shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]"
				onSubmit={handleSubmit}
			>
				<div className="space-y-2 relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={trackingCode}
						onChange={handleInputChange}
						minLength={20}
						maxLength={20}
						disabled={trackingLoading}
						required
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Código de Seguimiento
						<span className="text-red-500 font-black">*</span>
					</label>
					<button className="absolute right-2 top-[44%] transform -translate-y-1/2 bg-(--secondary-color) text-white font-semibold px-4 py-2 rounded-lg cursor-pointer hover:scale-110 hover:bg-(--primary-color) transition-all ease-in-out duration-300">
						<i className="fa-solid fa-magnifying-glass"></i>
					</button>
				</div>
				<div className="space-y-6 mt-5">
					{trackingLoading && (
						<div className="flex flex-col items-center justify-center py-6">
							<div className="flex flex-col items-center justify-center py-6">
								<LoaderWifi />
							</div>
						</div>
					)}
					{trackingError && !trackingLoading && (
						<div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
							<div className="flex">
								<div className="flex-shrink-0">
									<ErrorIcon />
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium">
										No se encontró la denuncia
									</p>
									<p className="text-sm mt-1">
										{trackingError}
									</p>
								</div>
							</div>
						</div>
					)}
					{!trackingLoading &&
						!trackingError &&
						trackingData &&
						trackingData.data && (
							<div className="mt-2 relative">
								{trackingData.data.length > 0 && (
									<div className="bg-white rounded-lg p-5 shadow-md mb-8 border-l-4 border-blue-500">
										<h3 className="text-lg font-bold text-gray-800 mb-2">
											Información de la denuncia
										</h3>
										<div className="flex items-center">
											<span className="text-sm font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
												{trackingCode}
											</span>
										</div>
									</div>
								)}
								<div className="relative">
									{trackingData.data.length > 1 && (
										<div className="absolute left-8 top-6 bottom-0 w-0.5 bg-gradient-to-b from-(--primary-color) to-gray-200"></div>
									)}
									<div className="space-y-8">
										{trackingData.data.map(
											(tracking, index) => {
												const statusColor = getStatusColor(tracking.estado);
												const statusIcon = getStatusIcon(tracking.estado);
												const isFirst = index === 0;
												return (
													// Contenedor
													<div
														key={tracking.fecha_actualizacion}
														className={`relative pl-16 animate-fadeIn ${isFirst? "animate-pulse": ""}`}
														style={{animationDelay: `${index * 150}ms`,}}
													>
														{/* icono */}
														<div
															className={`absolute left-[18px] top-3 w-8 h-8 rounded-full flex items-center justify-center ${statusColor.split(" ")[0]} border-2 ${statusColor.split(" ")[2]}`}
														>
															<i className={`fa-solid ${statusIcon} text-sm ${statusColor.split(" ")[1]}`}
															></i>
														</div>
														<div className={`bg-transparent rounded-lg p-5 shadow-md border-l-4 ${statusColor.split(" ")[2]}`}
														>
															<div className="flex justify-between items-center mb-3">
																<h3 className="text-lg font-semibold capitalize">
																	{tracking.estado.replace(/_/g," ")}
																</h3>
																<span
																	className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
																>
																	{isFirst
																		? "Actual"
																		: "Anterior"}
																</span>
															</div>
															<p className="text-gray-600 mb-3 whitespace-pre-line">
																{tracking.comentario}
															</p>
															<div className="flex items-center text-sm text-gray-500">
																<i className="fa-regular fa-calendar-check mr-2"></i>
																<time>
																	{formatDate(tracking.fecha_actualizacion)}
																</time>
															</div>
														</div>
													</div>
												);
											}
										)}
									</div>
								</div>
								{trackingData.data.length === 0 && (
									<div className="bg-amber-50 rounded-lg p-4 text-amber-800 flex items-center">
										<i className="fa-solid fa-exclamation-triangle mr-3"></i>
										<p>
											No hay información de seguimiento
											disponible para esta denuncia.
										</p>
									</div>
								)}
							</div>
						)}
				</div>
			</form>
		</div>
	);
};

import { useTracking } from "../../hooks/useTracking";
import { LoaderWifi } from "../../Components/Loaders/LoaderWiFi";
export const TrackingDenuncia = () => {
	const {
		trackingCode,
		handleInputChange,
		handleSubmit,
		trackingData,
		trackingLoading,
		trackingError,
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
						trackingData.data &&
						trackingData.data.map((tracking) => (
							<div
								key={tracking.fecha_actualizacion}
								className="bg-white rounded-lg p-4 shadow-md"
							>
								<h3 className="text-lg font-semibold text-gray-800">
									{tracking.estado}
								</h3>
								<p className="text-gray-600">
									{tracking.comentario}
								</p>
								<p className="text-sm font-semibold text-gray-500">
									{tracking.fecha_actualizacion}
								</p>
							</div>
						))}
					{trackingData?.data && trackingData.data.length === 0 && (
						<div className="bg-amber-50 rounded-lg p-4 text-amber-800 flex items-center">
							<i className="fa-solid fa-exclamation-triangle mr-3"></i>
							<p>
								No hay información de seguimiento disponible
								para esta denuncia.
							</p>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

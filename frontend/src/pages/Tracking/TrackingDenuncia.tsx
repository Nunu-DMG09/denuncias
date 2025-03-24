import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useFormContext } from "../../hooks/useFormContext";
import { LoaderWifi } from "../../Components/Loaders/LoaderWiFi";
export const TrackingDenuncia = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [trackingCode, setTrackingCode] = useState<string>(
		searchParams.get("codigo") || ""
	);
	const {
		trackingData,
		trackingLoading,
		trackingError,
		resetTracking,
		consultarTracking,
	} = useFormContext();

	useEffect(() => {
		const codigo = searchParams.get("codigo");
		if (codigo && codigo.trim() !== "") {
			setTrackingCode(codigo);
			consultarTracking(codigo);
		}
		return () => resetTracking();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTrackingCode(e.target.value);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (await consultarTracking(trackingCode)) {
			setSearchParams({ codigo: trackingCode });
		}
	};

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
									<svg
										className="h-5 w-5 text-red-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
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

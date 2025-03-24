import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useFormContext } from "../../hooks/useFormContext";
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
							<div className="w-12 h-12 border-4 border-t-4 border-(--primary-color) border-t-transparent rounded-full animate-spin"></div>
							<p className="mt-4 text-gray-600">
								Buscando información...
							</p>
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
						trackingData.data && (
							<div className="space-y-6">
								<div className="flex justify-between items-center border-b pb-4">
									<p className="text-base font-bold text-gray-800">
										Estado de la Denuncia
									</p>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
											trackingData.data.estado ===
											"registrado"
												? "bg-yellow-500"
												: trackingData.data.estado ===
												  "en_proceso"
												? "bg-blue-500"
												: trackingData.data.estado ===
												  "finalizado"
												? "bg-green-500"
												: "bg-gray-500"
										}`}
									>
										{trackingData.data.estado.toUpperCase()}
									</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex flex-col">
										<span className="text-sm text-gray-500">
											Última actualización
										</span>
										<span className="font-medium">
											{trackingData.data
												.fecha_actualizacion
												? new Date(
														trackingData.data.fecha_actualizacion
												  ).toLocaleDateString(
														"es-ES",
														{
															day: "2-digit",
															month: "2-digit",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														}
												  )
												: "No disponible"}
										</span>
									</div>
								</div>

								{trackingData.data.comentario && (
									<div className="mt-4 p-4 bg-blue-50 rounded-lg">
										<h4 className="text-sm font-bold text-blue-800 mb-1">
											Observaciones:
										</h4>
										<p className="text-gray-700">
											{trackingData.data.comentario}
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

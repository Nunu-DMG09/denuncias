import { useState, useEffect, use } from "react";
import { useSearchParams } from "react-router";
import { useFormContext } from "../../hooks/useFormContext";
import { formatDate } from "../../utils";
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
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-3xl">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
				Seguimiento de Denuncia
			</h2>
			<form
				className="rounded-lg p-6 shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]"
				onSubmit={(e) => e.preventDefault()}
			>
				<div className="space-y-2 relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						// value={numeroDocumento}
						// onChange={handleDocumentoChange}
						minLength={20}
						maxLength={20}
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
					<div className="flex justify-between items-center">
						<p className="text-base text-gray-800 font-semibold">
							Estado de la Denuncia
						</p>
						<p className="text-base text-gray-800 font-semibold">
							Fecha
						</p>
						<p className="text-base">Comentarios</p>
					</div>
					<div className="flex justify-between items-center">
						<p className="text-base text-gray-800">En Proceso</p>
						<p className="text-base text-gray-800">10/10/2021</p>
						<p className="text-base text-gray-800">En Proceso</p>
					</div>
					<div className="flex justify-between items-center">
						<p className="text-base text-gray-800">En Proceso</p>
						<p className="text-base text-gray-800">En Proceso</p>
						<p className="text-base text-gray-800">10/10/2021</p>
					</div>
					<div className="flex justify-between items-center">
						<p className="text-base text-gray-800">En Proceso</p>
						<p className="text-base text-gray-800">En Proceso</p>
						<p className="text-base text-gray-800">10/10/2021</p>
					</div>
				</div>
			</form>
		</div>
	);
};

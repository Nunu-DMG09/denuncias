import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import { useDenuncias } from "../hooks/useDenuncias";
import { useFormContext } from "../hooks/useFormContext";
import { useMemo } from "react";
import { FilesProgressBar } from "../Components/FilesProgressBar";
import { calcTotalSize, MAX_SIZE_BYTES, MAX_FILES } from "../utils";

export const InfoDenuncia = () => {
	const { startDate,  handleDate } =
		useDenuncias();
	const { motivos, formData, updateFormData, addAdjunto, removeAdjunto } =
		useFormContext();
	const sortedMotivos = useMemo(() => {
		if (!motivos.length) return [];
		return [...motivos].sort((a, b) => {
			if (a.nombre.toLowerCase() === "otros") return 1;
			if (b.nombre.toLowerCase() === "otros") return -1;
			return 0;
		});
	}, [motivos]);
	const totalSize = calcTotalSize(formData.adjuntos);

	return (
		<div className="space-y-6">
			{/* Date Input */}
			<div className="space-y-2">
				<h3 className="font-medium text-gray-900">
					Fecha del incidente
				</h3>
				<DatePicker
					selected={startDate}
					onChange={(date) => handleDate(date)}
					className="w-full px-4 py-2 border rounded-md transition-all duration-300 ease focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) outline-none"
					placeholderText="Selecciona una fecha"
					dateFormat={"dd/MM/yyyy"}
					locale={"es"}
				/>
			</div>

			{/* Radio Options */}
			<div className="space-y-4">
				<h3 className="font-medium text-gray-900">
					Identifique el motivo de la denuncia
				</h3>
				{sortedMotivos.map((motivo) => (
					<div
						key={motivo.id}
						className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300"
					>
						<input
							type="radio"
							name="reason"
							id={`reason-${motivo.nombre}`}
							className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
							onChange={() =>
								updateFormData("motivo_id", motivo.id)
							}
							checked={formData.motivo_id === motivo.id}
						/>
						<label
							htmlFor={`reason-${motivo.nombre}`}
							className="flex-1 cursor-pointer"
						>
							<span className="font-medium text-gray-700">
								{motivo.nombre}
							</span>
							<p className="text-gray-500 text-sm mt-1">
								{motivo.descripcion}
							</p>
						</label>
					</div>
				))}
			</div>
			{/* Después del map de radio buttons */}
			{formData.motivo_id === "moac37b6" && (
				<div className="relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={formData.motivo_otro}
						onChange={(e) =>
							updateFormData("motivo_otro", e.target.value)
						}
					/>
					<label className="absolute top-1/2 left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Describa el motivo de la denuncia
					</label>
				</div>
			)}
			{/* Additional Details */}
			<div className="space-y-4">
				<div className="relative">
					<textarea
						className="min-h-[3em] max-h-[10em] resize-none field-sizing-content w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={formData.descripcion}
						onChange={(e) =>
							updateFormData("descripcion", e.target.value)
						}
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Cuéntanos qué sucedió
					</label>
				</div>

				<div>
					<h3 className="font-medium text-gray-900">
						Archivos adjuntos
					</h3>
					<FilesProgressBar
						currentSize={totalSize}
						maxSize={MAX_SIZE_BYTES}
						fileCount={formData.adjuntos.length}
						maxFiles={MAX_FILES}
					/>
					<label
						className="flex items-center gap-4 md:gap-0 justify-center px-4 py-2 rounded-md text-white bg-(--secondary-color) hover:bg-(--primary-color) hover:scale-105 w-1/2 md:w-1/3 cursor-pointer mx-auto transition-all ease-out duration-300"
						htmlFor="file"
					>
						<i className="fas fa-paperclip mr-2"></i>
						Adjuntar Pruebas
					</label>
					<input
						type="file"
						className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						id="file"
						onChange={(e) => {
							if (e.target.files?.[0]) {
								addAdjunto(e.target.files[0]);
								e.target.value = "";
							}
						}}
						hidden
					/>
					{formData.adjuntos.length > 0 && (
						<div className="mt-4">
							<h4 className="font-medium text-sm text-gray-700 mb-2">
								Archivos adjuntos:
							</h4>
							<ul className="space-y-2">
								{formData.adjuntos.map((adjunto, index) => (
									<li
										key={index}
										className="flex items-center justify-between p-2 bg-gray-50 rounded"
									>
										<span>{adjunto.name}</span>
										<button
											type="button"
											onClick={() => removeAdjunto(index)}
											className="text-red-500 hover:text-red-700"
										>
											<i className="fas fa-trash"></i>
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

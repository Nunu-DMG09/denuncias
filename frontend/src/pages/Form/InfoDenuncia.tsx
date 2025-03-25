import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import { useDenuncias } from "../../hooks/useDenuncias";
import { useFormContext } from "../../hooks/useFormContext";
import { AddFiles } from "../../Components/Form/AddFiles";
import { ReasonsList } from "../../Components/Form/ReasonsList";
import { useEffect, useState } from "react";

export const InfoDenuncia = () => {
	const { startDate, handleDate } = useDenuncias();
	const { formData, updateFormData } = useFormContext();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);
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
			<div className="motivos-container min-h-[200px] transition-all duration-300">
				{isLoading ? <MotivosLoader /> : <ReasonsList />}
			</div>

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
			</div>
			<AddFiles />
		</div>
	);
};

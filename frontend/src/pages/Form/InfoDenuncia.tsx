import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import { useDenuncias } from "../../hooks/Form/useDenuncias";
import { useFormContext } from "../../hooks/Form/useFormContext";
import { AddFiles } from "../../Components/Form/AddFiles";
import { ReasonsList } from "../../Components/Form/ReasonsList";
import { MotivosLoader } from "../../Components/Loaders/MotivosLoader";
import { MotivosError } from "../../Components/Errors/MotivosError";
import { CharCounter } from "../../Components/Form/CharCounter";

export const InfoDenuncia = () => {
	const { startDate, handleDate, isLoading, error } = useDenuncias();
	const { formData, updateFormData } = useFormContext();
	return (
		<div className="space-y-6">
			{/* Date Input */}
			<div className="space-y-2">
				<h3 className="font-medium text-gray-900">
					Fecha del incidente
				</h3>
				<DatePicker
					selected={formData.fecha_incidente ? new Date(formData.fecha_incidente) : startDate}
					onChange={(date) => {
						handleDate(date)
						updateFormData("fecha_incidente", date?.toISOString() || "");
					}}
					className="w-full px-4 py-2 border rounded-md transition-all duration-300 ease focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) outline-none"
					placeholderText="Selecciona una fecha"
					dateFormat={"dd/MM/yyyy"}
					locale={"es"}
					maxDate={new Date()}
				/>
			</div>
			<div className="motivos-container min-h-[200px] transition-all duration-300">
				{isLoading ? (
					<MotivosLoader />
				) : error ? (
					<MotivosError error={error} />
				) : (
					<ReasonsList />
				)}
			</div>

			{/* Additional Details */}
			<div className="space-y-4">
				<div className="relative">
					<textarea
						className="min-h-[3em] max-h-[10em] resize-none field-sizing-content w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={formData.descripcion}
						maxLength={250}
						onChange={(e) =>
							updateFormData("descripcion", e.target.value)
						}
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Cuéntanos qué sucedió
					</label>
					<CharCounter value={formData.descripcion} maxLength={250} />
				</div>
			</div>
			<AddFiles />
		</div>
	);
};

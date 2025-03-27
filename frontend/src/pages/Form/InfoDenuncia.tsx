import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import "react-datepicker/dist/react-datepicker.css";
import { useDenuncias } from "../../hooks/useDenuncias";
import { useFormContext } from "../../hooks/useFormContext";
import { AddFiles } from "../../Components/Form/AddFiles";
import { ReasonsList } from "../../Components/Form/ReasonsList";
import { MotivosLoader } from "../../Components/Loaders/MotivosLoader";

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
					selected={startDate}
					onChange={(date) => handleDate(date)}
					className="w-full px-4 py-2 border rounded-md transition-all duration-300 ease focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) outline-none"
					placeholderText="Selecciona una fecha"
					dateFormat={"dd/MM/yyyy"}
					locale={"es"}
				/>
			</div>
			<div className="motivos-container min-h-[200px] transition-all duration-300">
				{isLoading ? (
					<MotivosLoader />
				) : error ? (
					<div className="flex flex-col items-center justify-center h-64 text-center">
						<div className="text-red-600 mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 mx-auto"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<h3 className="text-lg font-medium mt-2">
								Error de carga
							</h3>
						</div>
						<p className="text-gray-600 mb-4">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-(--primary-color) text-white rounded hover:bg-(--secondary-color) transition-all cursor-pointer duration-300 ease"
						>
							Reintentar
						</button>
					</div>
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

import { useMemo } from "react";
import { useFormContext } from "../hooks/useFormContext";

export const ReasonsList = () => {
	const { formData, updateFormData, motivos } = useFormContext();
	const sortedMotivos = useMemo(() => {
		if (!motivos.length) return [];
		return [...motivos].sort((a, b) => {
			if (a.nombre.toLowerCase() === "otros") return 1;
			if (b.nombre.toLowerCase() === "otros") return -1;
			return 0;
		});
	}, [motivos]);
	return (
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
						onChange={() => updateFormData("motivo_id", motivo.id)}
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
			{formData.motivo_id === "mo_otros" && (
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
		</div>
	);
};

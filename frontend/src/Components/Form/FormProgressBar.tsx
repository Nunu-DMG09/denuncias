import { useFormContext } from "../../hooks/Form/useFormContext";

export const FormProgressBar = () => {
    const { currentPage } = useFormContext();
	return (
		<div className="mb-8">
			<div className="flex justify-between mb-2">
				{["Detalles", "Denunciado", "Denunciante", "Resumen"].map(
					(step, index) => (
						<div
							key={index}
							className={`text-sm text-center ${
								currentPage === index + 1
									? "font-bold text-(--primary-color)"
									: "text-gray-500"
							}`}
						>
							{step}
						</div>
					)
				)}
			</div>
			<div className="w-full bg-gray-200 h-2 rounded-full">
				<div
					className={`${
						currentPage === 4 ? 'bg-green-500' : 'bg-(--primary-color)'
					} h-2 rounded-full transition-all duration-300`}
					style={{ width: `${(currentPage / 4) * 100}%` }}
				></div>
			</div>
		</div>
	);
};

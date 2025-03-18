import { useFormContext } from "../hooks/useFormContext";
// import { toast } from "sonner";

export const FormNavigator = () => {
	const { currentPage, formData, nextPage, prevPage, submitForm, isLoading } =
		useFormContext();

	const TOTAL_PAGES = 3;

	const handleNext = () => {
		// validaciones despues
		nextPage();
	};
	const handleSubmit = async () => {
		await submitForm();
	};
	return (
		<div className="flex justify-end mt-8 w-full">
			{currentPage > 1 && (
				<button
					type="button"
					onClick={prevPage}
					disabled={isLoading}
					className="px-5 md:px-10 py-4 border border-(--gray-light) rounded-md text-(--gray) cursor-pointer hover:scale-105 hover:bg-gray-300 transition-all ease-out duration-300 bg-gray-200 mr-auto"
				>
					Atrás
				</button>
			)}
			{currentPage < TOTAL_PAGES ? (
				<button
					type="button"
					onClick={handleNext}
					disabled={isLoading}
					className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
				>
					Siguiente
				</button>
			) : (
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
				>
					{isLoading ? (
						<>
							<span className="inline-block animate-spin mr-2">
								⟳
							</span>
						</>
					) : (
						"Enviar Denuncia"
					)}
				</button>
			)}
		</div>
	);
};

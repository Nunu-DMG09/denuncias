import { useFormContext } from "../hooks/useFormContext";
import { Loader } from "./Loader";
import { toast } from "sonner";

export const FormNavigator = () => {
	const { currentPage, nextPage, prevPage, submitForm, isLoading, formData } =
		useFormContext();

	const TOTAL_PAGES = 4;

	const SUBMIT_PAGE = 3;

	const validatePage = (pageNumber: number): boolean => {
		switch (pageNumber) {
			case 1:
				if (!formData.motivo_id) {
					toast.error("Debes seleccionar un motivo de denuncia");
					return false;
				}
				if (formData.motivo_id === "otro" && !formData.motivo_otro) {
					toast.error("Debes especificar el motivo de la denuncia");
					return false;
				}
				if (
					!formData.descripcion ||
					formData.descripcion.trim().length < 10
				) {
					toast.error(
						"La descripción debe tener al menos N caracteres"
					);
					return false;
				}
				return true;
			case 2:
				if (!formData.denunciado.tipo_documento) {
					toast.error("Debes seleccionar un tipo de documento");
					return false;
				}
				if (!formData.denunciado.numero_documento) {
					toast.error("Debes ingresar un número de documento");
					return false;
				}
				if (
					formData.denunciado.tipo_documento ===
						"carnet-extranjeria" &&
					!formData.denunciado.nombre
				) {
					toast.error("Debes ingresar el nombre del denunciado");
					return false;
				}
				if (!formData.denunciado.cargo) {
					toast.error("Debes ingresar el cargo del denunciado");
					return false;
				}
				return true;
			case 3:
				if (!formData.es_anonimo) {
					if (!formData.denunciante?.tipo_documento) {
						toast.error("Debes seleccionar un tipo de documento");
						return false;
					}
					if (!formData.denunciante?.numero_documento) {
						toast.error("Debes ingresar un número de documento");
						return false;
					}
					if (formData.denunciado?.tipo_documento === "carjet-extranjeria" && !formData.denunciante?.nombres) {
						toast.error("Debes ingresar tu nombre completo");
						return false;
					}
					if (!formData.denunciante?.email && !formData.denunciante?.telefono) {
						toast.error("Debes ingresar al menos un medio de contacto");
						return false;
					}
					if (!formData.denunciante?.email){
						toast.error("Debes ingresar un correo electrónico");
						return false;
					}
					if (!formData.denunciante?.telefono){
						toast.error("Debes ingresar un número de teléfono");
						return false;
					}
					if (formData.denunciante?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.denunciante.email)) {
                        toast.error("El email ingresado no tiene un formato válido");
                        return false;
                    }
					if (formData.denunciante?.telefono && !/^\d{9}$/.test(formData.denunciante.telefono)) {
                        toast.error("El teléfono debe tener 9 dígitos");
                        return false;
                    }
					if(!formData.denunciante?.sexo){
						toast.error("Debes seleccionar un género");
						return false;
					}
				}
				return true
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (validatePage(currentPage)){
			nextPage();
		}
	};
	const handleSubmit = async () => {
		if (validatePage(currentPage)){
			const success: boolean = await submitForm();
			if (success) {
				nextPage();
			}
		}
	};
	return (
		<div className="flex justify-end mt-8 w-full">
			{currentPage > 1 && currentPage !== TOTAL_PAGES && (
				<button
					type="button"
					onClick={prevPage}
					disabled={isLoading}
					className="px-5 md:px-10 py-4 border border-(--gray-light) rounded-md text-(--gray) cursor-pointer hover:scale-105 hover:bg-gray-300 transition-all ease-out duration-300 bg-gray-200 mr-auto"
				>
					Atrás
				</button>
			)}
			{currentPage < SUBMIT_PAGE ? (
				<button
					type="button"
					onClick={handleNext}
					disabled={isLoading}
					className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
				>
					Siguiente
				</button>
			) : currentPage === SUBMIT_PAGE ? (
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
				>
					{isLoading ? <Loader isBtn={true} /> : "Enviar Denuncia"}
				</button>
			) : (
				<div className="w-full md:w-1/2 flex justify-center items-center my-0 mx-auto">
					<button
						type="button"
						onClick={() => (window.location.href = "/")}
						className={`w-full py-4 border-4 border-solid border-(--secondary-color) text-(--secondary-color) rounded-md text-center hover:bg-(--primary-color) hover:text-white hover:border-(--primary-color) cursor-pointer hover:scale-105 transition-all ease-out duration-300`}
					>
						<span className="flex items-center justify-center text-xl font-semibold text-center h-full w-full">
							<i className="fa-duotone fa-solid fa-file-pdf me-4 text-4xl"></i>
							Descargar PDF
						</span>
					</button>
				</div>
			)}
		</div>
	);
};

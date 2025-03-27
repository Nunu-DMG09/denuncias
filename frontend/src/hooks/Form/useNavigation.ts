import { useState } from "react";
import { validatePage } from "../../utils";
import { useFormContext } from "./useFormContext";
import { generarDenunciaPDF } from "../../services/pdfService";
import { toast } from "sonner";

export const useNavigation = () => {
	const { nextPage, formData, currentPage, submitForm, motivos } = useFormContext();
	const [isDownloading, setIsDownloading] = useState(false);

	const handleNext = () => {
		if (validatePage(currentPage, formData)) {
			nextPage();
		}
	};
	const handleSubmit = async () => {
		if (validatePage(currentPage, formData)) {
			const success: boolean = await submitForm();
			if (success) {
				nextPage();
			}
		}
	};
	const handleDownload = () => {
		setIsDownloading(true);

		try {
			generarDenunciaPDF(formData, motivos);

			toast.success(
				"PDF generado correctamente. Redirigiendo a la página principal..."
			);

			setTimeout(() => {
				window.location.href = "/";
			}, 3000);
		} catch (error) {
			console.error("Error al generar PDF:", error);
			toast.error("Ocurrió un error al generar PDF");
			setIsDownloading(false);
		}
	};
    return {
        handleNext,
        handleSubmit,
        handleDownload,
        isDownloading
    }
};

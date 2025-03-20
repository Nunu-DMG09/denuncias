import { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import api from "../utils/apiAxios";
import { AxiosError } from "axios";
import { validateFileAddition, ALLOWED_EXTENSIONS } from "../utils";
import type { Denunciado, Denunciante, FormData } from "../types.d";

interface FormContextType {
	currentPage: number;
	formData: FormData;
	isLoading: boolean;
	error: string | null;
	motivos: Array<{ id: string; nombre: string; descripcion: string }>;
	updateFormData: <K extends keyof FormData>(
		key: K,
		value: FormData[K]
	) => void;
	updateDenunciante: (data: Partial<Denunciante>) => void;
	updateDenunciado: (data: Partial<Denunciado>) => void;
	addAdjunto: (file: File) => void;
	removeAdjunto: (index: number) => void;
	nextPage: () => void;
	prevPage: () => void;
	submitForm: () => Promise<boolean>;
}

export const FormContext = createContext<FormContextType | undefined>(
	undefined
);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [motivos, setMotivos] = useState<
		Array<{ id: string; nombre: string; descripcion: string }>
	>([]);
	const [formData, setFormData] = useState<FormData>({
		es_anonimo: false,
		denunciante: {
			nombres: "",
			email: "",
			telefono: "",
			tipo_documento: "",
			numero_documento: "",
			sexo: "",
		},
		denunciado: {
			nombre: "",
			tipo_documento: "",
			numero_documento: "",
			representante_legal: "",
			razon_social: "",
			cargo: "",
		},
		motivo_id: "",
		motivo_otro: "",
		descripcion: "",
		adjuntos: [],
	});

	useEffect(() => {
		const fetchMotivos = async () => {
			try {
				const response = await api.get("/motivos");
				setMotivos(response.data);
			} catch (err) {
				console.error("Error al cargar motivos:", err);
			}
		};
		fetchMotivos();
	}, []);

	const updateFormData = <K extends keyof FormData>(
		key: K,
		value: FormData[K]
	) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		if (key === "es_anonimo" && value === true) {
			setFormData((prev) => ({
				...prev,
				denunciante: null,
			}));
		}
		if (key === "es_anonimo" && value === false) {
			setFormData((prev) => ({
				...prev,
				denunciante: {
					nombres: "",
					email: "",
					telefono: "",
					tipo_documento: "",
					numero_documento: "",
					sexo: "",
				},
			}));
		}
	};

	const updateDenunciante = (data: Partial<Denunciante>) => {
		if (formData.es_anonimo) return;
		setFormData((prev) => ({
			...prev,
			denunciante: {
				...prev.denunciante!,
				...data,
			},
		}));
	};

	const updateDenunciado = (data: Partial<Denunciado>) => {
		setFormData((prev) => ({
			...prev,
			denunciado: {
				...prev.denunciado,
				...data,
			},
		}));
	};

	const addAdjunto = (file: File) => {
		const validation = validateFileAddition(formData.adjuntos, {
			file,
			name: file.name,
		});
		if (validation.isInvalidType) {
			const fileExtension =
				file.name.split(".").pop()?.toLowerCase() || "desconocido";
			toast.error(
				`Tipo de archivo no permitido (.${fileExtension}). 
				Por favor, suba archivos de los siguientes tipos: ${ALLOWED_EXTENSIONS}`
			);
		}
		if (validation.isOverFileLimit) {
			toast.error("Máximo 5 archivos adjuntos");
			return;
		}

		if (validation.isOverSizeLimit) {
			toast.error(
				`El archivo excede el límite de tamaño. Tamaño del nuevo archivo: ${validation.newFileSizeMB.toFixed(
					2
				)}MB`
			);
			return;
		}

		setFormData((prev) => ({
			...prev,
			adjuntos: [...prev.adjuntos, { file, name: file.name }],
		}));
	};

	const removeAdjunto = (index: number) => {
		setFormData((prev) => ({
			...prev,
			adjuntos: prev.adjuntos.filter((_, i) => i !== index),
		}));
	};

	const nextPage = () => setCurrentPage((prev) => prev + 1);
	const prevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));

	const prepareDataForSubmission = () => {
		return {
			denuncia: {
				es_anonimo: formData.es_anonimo,
				motivo_id: formData.motivo_id,
				motivo_otro: formData.motivo_otro || null,
				descripcion: formData.descripcion,
				fecha_registro: new Date().toISOString().split("T")[0],
			},
			denunciante: !formData.es_anonimo
				? {
						...formData.denunciante,
				  }
				: null,
			denunciado: {
				nombre: formData.denunciado.nombre || null,
				tipo_documento: formData.denunciado.tipo_documento,
				numero_documento: formData.denunciado.numero_documento,
				representante_legal:
					formData.denunciado.representante_legal || null,
				razon_social: formData.denunciado.razon_social || null,
				cargo: formData.denunciado.cargo,
			},
			adjuntos: formData.adjuntos.map((adjunto) => ({
				file_name: adjunto.name,
				file_type: adjunto.file.type,
			})),
		};
	};

	const submitForm = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const submissionData = prepareDataForSubmission();
			const response = await api.post("/create", submissionData);
			if (response.data?.tracking_code) {
				setFormData((prev) => ({
					...prev,
					tracking_code: response.data.tracking_code,
				}));
			}
			if (formData.adjuntos.length > 0 && response.data?.denuncia_id) {
				const formDataFiles = new FormData();
				formData.adjuntos.forEach((adjunto, index) => {
					formDataFiles.append(`file${index}`, adjunto.file);
				});
				formDataFiles.append("denuncia_id", response.data.denuncia_id);
				await api.post("/denuncias/adjuntos", formDataFiles, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			}
			toast.success("Denuncia enviada correctamente");
			return true;
		} catch (err: unknown) {
			const axiosError = err as AxiosError<{ message?: string }>;
			const errorMsg =
				axiosError.response?.data?.message ||
				"Error al enviar la denuncia";
			setError(errorMsg);
			toast.error(errorMsg);
			console.error("Error al enviar formulario:", err);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const value: FormContextType = {
		currentPage,
		formData,
		isLoading,
		error,
		motivos,
		updateFormData,
		updateDenunciante,
		updateDenunciado,
		addAdjunto,
		removeAdjunto,
		nextPage,
		prevPage,
		submitForm,
	};

	return (
		<FormContext.Provider value={value}>{children}</FormContext.Provider>
	);
};

import { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import api, { apiTracking } from "../utils/apiAxios";
import { AxiosError } from "axios";
import { validateFileAddition, ALLOWED_EXTENSIONS } from "../utils";
import type {
	Denunciado,
	Denunciante,
	FormData,
	Motivo,
	TrackingData,
} from "../types.d";

interface DenunciasContextType {
	currentPage: number;
	formData: FormData;
	isLoading: boolean;
	error: string | null;
	motivos: Motivo[];
	trackingData: TrackingData | null;
	trackingLoading: boolean;
	trackingError: string | null;
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
	consultarTracking: (trackingCode: string) => Promise<boolean>;
	resetTracking: () => void;
}

export const FormContext = createContext<DenunciasContextType | undefined>(
	undefined
);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [motivos, setMotivos] = useState<Motivo[]>([]);
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
		fecha_incidente: null,
		adjuntos: [],
	});
	const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
	const [trackingLoading, setTrackingLoading] = useState(false);
	const [trackingError, setTrackingError] = useState<string | null>(null);

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
		if (key === "es_anonimo") {
			setFormData((prev) => ({
				...prev,
				[key]: value,
				denunciante:
					value === true
						? null
						: {
								nombres: "",
								email: "",
								telefono: "",
								tipo_documento: "",
								numero_documento: "",
								sexo: "",
						  },
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[key]: value,
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
			setTimeout(() => {
				toast.info(
					"Si tienes archivos demasiados pesados pero consideras que son necesarios, sube un archivo .txt con el link de algún repositorio o carpeta donde adjuntes todos los archivos."
				);
			}, 3000);
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
				fecha_incidente: formData.fecha_incidente,
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
			const formDataToSend = new FormData();
			formDataToSend.append("data", JSON.stringify(submissionData));
			formData.adjuntos.forEach((adjunto, i) => {
				formDataToSend.append(`file${i}`, adjunto.file);
			});
			const response = await api.post("/create", formDataToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			const data = response.data;
			if (
				data.success &&
				data.message === "Denuncia ya registrada previamente"
			) {
				setFormData((prev) => ({
					...prev,
					tracking_code: data.tracking_code,
				}));
				toast.success("Denuncia enviada correctamente");
				return true;
			}
			if (data.success && data.tracking_code) {
				setFormData((prev) => ({
					...prev,
					tracking_code: data.tracking_code,
				}));
				toast.success("Denuncia enviada correctamente");
				return true;
			}
			setError(data.error || "No se pudo registrar la denuncia.");
			toast.error(data.error || "No se pudo registrar la denuncia.");
			return false;
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

	const consultarTracking = async (trackingCode: string) => {
		if (!trackingCode.trim()) {
			toast.error("Código de seguimiento inválido");
			return false;
		}

		setTrackingLoading(true);
		setTrackingError(null);

		try {
			const response = await apiTracking.get(`/tracking/${trackingCode}`);
			const data = response.data;
			if (data && data.success) {
				setTrackingData(data);
				return true;
			} else {
				const errorMsg =
					data?.message || "Error al consultar el código";
				setTrackingError(errorMsg);
				toast.error(errorMsg);
				return false;
			}
		} catch (err: unknown) {
			const axiosError = err as AxiosError<{ message?: string }>;
			const errorMsg =
				axiosError.response?.data?.message ||
				"Error al consultar la denuncia";
			setTrackingError(errorMsg);
			toast.error(errorMsg);
			console.error("Error al consultar tracking:", err);
			return false;
		} finally {
			setTrackingLoading(false);
		}
	};

	const resetTracking = () => {
		setTrackingData(null);
		setTrackingError(null);
		setTrackingLoading(false);
	};

	const value: DenunciasContextType = {
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
		trackingData,
		trackingLoading,
		trackingError,
		consultarTracking,
		resetTracking,
	};

	return (
		<FormContext.Provider value={value}>{children}</FormContext.Provider>
	);
};

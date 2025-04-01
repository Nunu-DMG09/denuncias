// Para validar tamaño de archivos y tipos de archivos permitidos
import { toast } from "sonner";
import { Adjunto, FormData } from "../types";
export const MB = 1048576;
export const MAX_SIZE_BYTES = MB * 20;
export const MAX_FILES = 5;

export const ALLOWED_FILE_TYPES = {
	"image/jpeg": [".jpg", ".jpeg"],
	"image/png": [".png"],
	"image/gif": [".gif"],
	"image/bmp": [".bmp"],
	"image/webp": [".webp"],
	'image/avif': ['.avif'],
	"image/svg+xml": [".svg"],
	"application/pdf": [".pdf"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		".docx",
	],
	"application/msword": [".doc"],
	"text/plain": [".txt"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
		".xlsx",
	],
	"video/mp4": [".mp4"],
	"video/x-msvideo": [".avi"],
	"video/x-matroska": [".mkv"],
	"video/quicktime": [".mov"],
	"audio/mpeg": [".mp3"],
	"audio/wav": [".wav"],
	"audio/ogg": [".ogg"],
};
export const ALLOWED_EXTENSIONS = Object.values(ALLOWED_FILE_TYPES)
	.flat()
	.join(", ");
export const isFileTypeAllowed = (file: File) => {
	return Object.keys(ALLOWED_FILE_TYPES).includes(file.type);
};

export const calcTotalSize = (files: Adjunto[]) => {
	return files.reduce((tot, file) => tot + file.file.size, 0);
};

export const bytesToMB = (bytes: number) => {
	return bytes / MB;
};

export const validateFileAddition = (
	currentFiles: Adjunto[],
	newFile: Adjunto
) => {
	const currentSize = calcTotalSize(currentFiles);
	const newFileSize = newFile.file.size;
	const totalSize = currentSize + newFileSize;

	const isOverSizeLimit = totalSize > MAX_SIZE_BYTES;
	const isOverFileLimit = currentFiles.length >= MAX_FILES;
	const isValidFileType = isFileTypeAllowed(newFile.file);
	if (isOverSizeLimit || isOverFileLimit) {
		return {
			isValid: false,
			isOverSizeLimit,
			isOverFileLimit,
			isInvalidType: false,
			currentSizeMB: bytesToMB(currentSize),
			newFileSizeMB: bytesToMB(newFileSize),
			totalSizeMB: bytesToMB(totalSize),
			remainingSizeMB: 20 - bytesToMB(currentSize),
			fileType: newFile.file.type,
		};
	}
	if (!isValidFileType) {
		return {
			isValid: false,
			isOverSizeLimit: false,
			isOverFileLimit: false,
			isInvalidType: true,
			currentSizeMB: bytesToMB(calcTotalSize(currentFiles)),
			newFileSizeMB: bytesToMB(newFile.file.size),
			totalSizeMB: 0,
			remainingSizeMB: 0,
			fileType: newFile.file.type,
		};
	}

	return {
		isValid: true,
		isOverSizeLimit: false,
		isOverFileLimit: false,
		isInvalidType: false,
		currentSizeMB: bytesToMB(currentSize),
		newFileSizeMB: bytesToMB(newFileSize),
		totalSizeMB: bytesToMB(totalSize),
		remainingSizeMB: 20 - bytesToMB(totalSize),
		fileType: newFile.file.type,
	};
};

// Para validaciones entre páginas
export const TOTAL_PAGES = 4;

export const SUBMIT_PAGE = 3;

export const validatePage = (
	pageNumber: number,
	formData: FormData
): boolean => {
	switch (pageNumber) {
		case 1:
			if (!formData.fecha_incidente) {
				toast.error("Debes seleccionar una fecha de incidente");
				return false;
			}
			if (
				formData.fecha_incidente >
				new Date().toISOString().split("T")[0]
			) {
				toast.error(
					"La fecha de incidente no puede ser mayor a la fecha actual"
				);
				return false;
			}
			if (!formData.motivo_id) {
				toast.error("Debes seleccionar un motivo de denuncia");
				return false;
			}
			if (formData.motivo_id === "mo_otros" && !formData.motivo_otro) {
				toast.error("Debes especificar el motivo de la denuncia");
				return false;
			}
			if (
				!formData.descripcion ||
				formData.descripcion.trim().length < 50
			) {
				toast.error("La descripción debe tener al menos 50 caracteres");
				return false;
			}
			if (formData.descripcion.trim().length >= 250){
				toast.error("La descripción no puede tener más de 250 caracteres");
				return false
			}

			if (formData.adjuntos.length > 0) {
				const invalidFiles = formData.adjuntos.filter(
					(file) => !isFileTypeAllowed(file.file)
				);
				if (invalidFiles.length > 0) {
					toast.error(
						`Los siguientes archivos no son válidos: ${invalidFiles
							.map((file) => file.name)
							.join(
								", "
							)}. Los formatos permitidos son: ${ALLOWED_EXTENSIONS}`
					);
					return false;
				}
				const totalSize = calcTotalSize(formData.adjuntos);
				if (totalSize > MAX_SIZE_BYTES) {
					toast.error(
						`El tamaño total de los archivos adjuntos excede el límite permitido (20MB). 
						Por favor, elimina algunos archivos o sube archivos más ligeros.`
					);
					return false;
				}
				if (formData.adjuntos.length > MAX_FILES) {
					toast.error(
						`Solo puedes subir un máximo de ${MAX_FILES} archivos`
					);
					return false;
				}
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
				formData.denunciado.tipo_documento === "carnet-extranjeria" &&
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
				if (
					formData.denunciado?.tipo_documento ===
						"carjet-extranjeria" &&
					!formData.denunciante?.nombres
				) {
					toast.error("Debes ingresar tu nombre completo");
					return false;
				}
				if (
					!formData.denunciante?.email &&
					!formData.denunciante?.telefono
				) {
					toast.error("Debes ingresar al menos un medio de contacto");
					return false;
				}
				if (!formData.denunciante?.email) {
					toast.error("Debes ingresar un correo electrónico");
					return false;
				}
				if (!formData.denunciante?.telefono) {
					toast.error("Debes ingresar un número de teléfono");
					return false;
				}
				if (
					formData.denunciante?.email &&
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
						formData.denunciante.email
					)
				) {
					toast.error(
						"El email ingresado no tiene un formato válido"
					);
					return false;
				}
				if (
					formData.denunciante?.telefono &&
					!/^\d{9}$/.test(formData.denunciante.telefono)
				) {
					toast.error("El teléfono debe tener 9 dígitos");
					return false;
				}
				if (!formData.denunciante?.sexo) {
					toast.error("Debes seleccionar un género");
					return false;
				}
				if (
					formData.denunciado &&
					!formData.es_anonimo &&
					formData.denunciante.numero_documento ===
						formData.denunciado.numero_documento
				) {
					toast.error(
						"El denunciante no puede ser el mismo que el denunciado"
					);
					return false;
				}
			}
			return true;
		default:
			return true;
	}
};

// Para formato de fechas
export const formatDate = (date: Date) => {
	if (!date) return "";

	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

// Para colores dinamicos
export const getStatusColor = (status: string) => {
	switch (status) {
		case "registrado":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "en proceso":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "resuelto":
			return "bg-green-100 text-green-800 border-green-200";
		case "rechazado":
			return "bg-red-100 text-red-800 border-red-200";
		case "recibida":
			return "bg-purple-100 text-purple-800 border-purple-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
}
// Para validar tamaño de archivos y tipos de archivos permitidos
import { Adjunto } from "../types";
export const MB = 1048576;
export const MAX_SIZE_BYTES = MB * 20;
export const MAX_FILES = 5;

export const ALLOWED_FILE_TYPES = {
	"image/jpeg": [".jpg", ".jpeg"],
	"image/png": [".png"],
	"image/gif": [".gif"],
	"image/bmp": [".bmp"],
	"image/webp": [".webp"],
	"application/pdf": [".pdf"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		".docx",
	],
	"application/msword": [".doc"],
	"text/plain": [".txt"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
		".xlsx",
	],
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
	const isValidFileType = isFileTypeAllowed(newFile.file);
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
	const currentSize = calcTotalSize(currentFiles);
	const newFileSize = newFile.file.size;
	const totalSize = currentSize + newFileSize;

	const isOverSizeLimit = totalSize > MAX_SIZE_BYTES;
	const isOverFileLimit = currentFiles.length >= MAX_FILES;

	return {
		isValid: !isOverSizeLimit && !isOverFileLimit,
		isOverSizeLimit,
		isOverFileLimit,
        isInvalidType: false,
		currentSizeMB: bytesToMB(currentSize),
		newFileSizeMB: bytesToMB(newFileSize),
		totalSizeMB: bytesToMB(totalSize),
		remainingSizeMB: 20 - bytesToMB(totalSize),
        fileType: newFile.file.type,
	};
};

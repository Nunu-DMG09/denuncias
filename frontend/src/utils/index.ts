export const MB = 1048576;
export const MAX_SIZE_BYTES = MB * 20;
export const MAX_FILES = 5;

export const calcTotalSize = (files: Adjunto[]) => {
    return files.reduce((tot, file) => tot + file.file.size, 0);
}

export const bytesToMB = (bytes: number) => {
    return bytes / MB;
}

export const validateFileAddition = (currentFiles: Adjunto[], newFile: Adjunto) => {
    const currentSize = calcTotalSize(currentFiles);
    const newFileSize = newFile.size;
    const totalSize = currentSize + newFileSize;

    const isOverSizeLimit = totalSize > MAX_SIZE_BYTES;
    const isOverFileLimit = currentFiles.length >= MAX_FILES;

    return {
        isValid: !isOverSizeLimit && !isOverFileLimit,
        isOverSizeLimit,
        isOverFileLimit,
        currentSizeMB: bytesToMB(currentSize),
        newFileSizeMB: bytesToMB(newFileSize),
        totalSizeMB: bytesToMB(totalSize),
        remainingSizeMB: 20 - bytesToMB(totalSize),
    }
}
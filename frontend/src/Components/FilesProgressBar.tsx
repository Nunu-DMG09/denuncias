import { bytesToMB } from "../utils";

interface FilesProgressBarProps {
	currentSize: number;
	maxSize: number;
	fileCount: number;
	maxFiles: number;
}

export const FilesProgressBar = ({
	currentSize,
	maxSize,
	fileCount,
	maxFiles,
}: FilesProgressBarProps) => {
	const currentSizeMB = bytesToMB(currentSize);
	const maxSizeMB = bytesToMB(maxSize);
	const percentage = (currentSizeMB / maxSizeMB) * 100;

	const getBarColor = () => {
		if (percentage < 50) return "bg-green-500";
		if (percentage < 80) return "bg-yellow-500";
		return "bg-red-500";
	};

	return (
		<div className="w-full mb-4">
			<div className="flex justify-between mb-1">
				<div className="text-sm font-medium text-gray-700">
					Almacenamiento: {currentSizeMB.toFixed(2)}MB / {maxSizeMB}MB
				</div>
				<div className="text-sm font-medium text-gray-700">
					{fileCount}/{maxFiles} archivos
				</div>
			</div>
			<div className="w-full h-2 5 bg-gray-200 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${getBarColor()} transition-all duration-300 ease-in-out`}
					style={{ width: `${percentage}%` }}
					role="progressbar"
					aria-valuenow={percentage}
					aria-valuemin={0}
					aria-valuemax={100}
				></div>
			</div>
			<div className="text-xs text-right mt-1 text-gray-500">
				{(maxSizeMB - currentSizeMB).toFixed(2)}MB restantes
			</div>
		</div>
	);
};

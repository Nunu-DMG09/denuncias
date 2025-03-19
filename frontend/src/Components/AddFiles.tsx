import { FilesProgressBar } from "./FilesProgressBar";
import { useFormContext } from "../hooks/useFormContext";
import {
	calcTotalSize,
	MAX_SIZE_BYTES,
	MAX_FILES,
	ALLOWED_EXTENSIONS,
} from "../utils";
export const AddFiles = () => {
	const { formData, addAdjunto, removeAdjunto } = useFormContext();
	const totalSize = calcTotalSize(formData.adjuntos);
	return (
		<div>
			{formData.adjuntos.length > 0 && (
				<div className="space-y-4">
					<h3 className="font-medium text-gray-900">
						Archivos adjuntos
					</h3>
					<FilesProgressBar
						currentSize={totalSize}
						maxSize={MAX_SIZE_BYTES}
						fileCount={formData.adjuntos.length}
						maxFiles={MAX_FILES}
					/>
				</div>
			)}
			<label
				className="flex items-center gap-4 md:gap-0 justify-center px-4 py-2 rounded-md text-white bg-(--secondary-color) hover:bg-(--primary-color) hover:scale-105 w-1/2 md:w-1/3 cursor-pointer mx-auto transition-all ease-out duration-300"
				htmlFor="file"
			>
				<i className="fas fa-paperclip mr-2"></i>
				Adjuntar Pruebas
			</label>
			<div className="text-xs text-gray-500 mt-2 text-center">
				Formatos permitidos: {ALLOWED_EXTENSIONS}
			</div>
			<input
				type="file"
				className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				id="file"
				onChange={(e) => {
					if (e.target.files?.[0]) {
						addAdjunto(e.target.files[0]);
						e.target.value = "";
					}
				}}
				hidden
				accept={ALLOWED_EXTENSIONS}
			/>
			{formData.adjuntos.length > 0 && (
				<div className="mt-4">
					<h4 className="font-medium text-sm text-gray-700 mb-2">
						Archivos adjuntos:
					</h4>
					<ul className="space-y-2">
						{formData.adjuntos.map((adjunto, index) => (
							<li
								key={index}
								className="flex items-center justify-between p-2 bg-gray-50 rounded"
							>
								<span>{adjunto.name}</span>
								<button
									type="button"
									onClick={() => removeAdjunto(index)}
									className="text-red-500 hover:text-red-700 cursor-pointer"
								>
									<i className="fas fa-trash"></i>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

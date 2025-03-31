import { DenunciaRecibida } from "../../types";
import { getStatusColor } from "../../utils";
import {
	CalendarIcon,
	CommentIcon,
	DownloadIcon,
	HistorialIcon,
	PersonIcon,
	WarnIcon,
	XIcon,
} from "../Icons";
import { useAdminDenunciasRecibidas } from "../../hooks/Admin/Denuncias/useAdminDenunciasRecibidas";
import { Loader } from "../Loaders/Loader";

interface ExpandedRecievedRowProps {
	denuncia: DenunciaRecibida;
	onClose: (tracking_code: string) => void;
	onEdit: (tracking_code: string) => void;
	isEditing: boolean;
	onCommentChange: (tracking_code: string, value: string) => void;
	commentValue: string;
	onStateChange: (tracking_code: string, value: string) => void;
	stateValue: string;
	onUpdate: (tracking_code: string) => void;
	onDownload: (tracking_code: string) => void;
	isDownloading?: boolean;
}

export const ExpandedRecievedRow = ({
	denuncia,
	onClose,
	onEdit,
	isEditing,
	onCommentChange,
	commentValue,
	onStateChange,
	stateValue,
	onUpdate,
	onDownload,
	isDownloading,
}: ExpandedRecievedRowProps) => {
	const { getStatusDescription, formatDate } = useAdminDenunciasRecibidas();
	return (
		<tr key={`details-${denuncia.tracking_code}`}>
			<td colSpan={6} className="p-0">
				<div className="animate-fadeIn bg-gradient-to-r from-indigo-50 to-blue-50 border-t-4 border-indigo-500 rounded-b-lg shadow-inner">
					<div className="p-6">
						<div className="flex justify-between items-center mb-5 pb-4 border-b border-indigo-100">
							<h3 className="text-xl font-bold text-gray-800 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 mr-2 text-indigo-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Denuncia #{denuncia.tracking_code}
							</h3>
							{isEditing && (
								<div className="relative inline-block">
									<select
										className="appearance-none bg-white border border-indigo-300 text-gray-700 py-2 pl-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium transition-all duration-200"
										value={stateValue || denuncia.estado}
										onChange={(e) =>
											onStateChange(
												denuncia.tracking_code,
												e.target.value
											)
										}
									>
										<option value="en proceso">
											En Proceso
										</option>
										<option value="resuelto">
											Finalizada
										</option>
										<option value="rechazado">
											Rechazada
										</option>
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-500">
										<svg
											className="h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							)}
							<span
								className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
									denuncia.estado
								)}`}
							>
								{denuncia.estado.replace("_", " ")}
							</span>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="col-span-1">
								<div className="bg-white rounded-lg shadow-sm p-4 mb-5 border-l-4 border-(--primary-color)">
									<h4 className="flex items-center text-lg font-semibold text-(--primary-color) mb-3">
										<PersonIcon />
										Denunciante
									</h4>
									<ul className="mt-2 space-y-2">
										<li className="flex items-center text-gray-700">
											<span className="w-20 text-xs uppercase text-gray-500 font-medium">
												Nombre:
											</span>
											<span className="font-semibold ml-2">
												{denuncia.denunciante_nombre}
											</span>
										</li>
										<li className="flex items-center text-gray-700">
											<span className="w-20 text-xs uppercase text-gray-500 font-medium">
												DNI:
											</span>
											<span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm ml-2">
												{denuncia.denunciante_dni}
											</span>
										</li>
									</ul>
								</div>
								<div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
									<h4 className="flex items-center text-lg font-semibold text-red-600 mb-3">
										<WarnIcon />
										Denunciado
									</h4>
									<ul className="mt-2 space-y-2">
										<li className="flex items-center text-gray-700">
											<span className="w-20 text-xs uppercase text-gray-500 font-medium">
												Nombre:
											</span>
											<span className="font-semibold ml-2">
												{denuncia.denunciado_nombre}
											</span>
										</li>
										<li className="flex items-center text-gray-700">
											<span className="w-20 text-xs uppercase text-gray-500 font-medium">
												DNI:
											</span>
											<span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm ml-2">
												{denuncia.denunciado_dni}
											</span>
										</li>
									</ul>
								</div>
							</div>
							<div className="col-span-1">
								<div className="bg-white rounded-lg shadow-sm p-4 h-full border-l-4 border-violet-400">
									<h4 className="flex items-center text-lg font-semibold text-violet-700 mb-3">
										<CalendarIcon />
										Detalles del Incidente
									</h4>
									<div className="mb-4">
										<h5 className="text-sm uppercase text-gray-500 font-medium mb-1">
											Motivo
										</h5>
										<p className="text-gray-800 font-semibold bg-violet-50 p-2 rounded">
											{denuncia.motivo}
										</p>
										{denuncia.motivo_otro && (
											<div className="my-4">
												<h5 className="text-sm uppercase text-gray-500 font-medium mb-1">
													Motivo Especificado
												</h5>
												<p className="text-gray-800 font-semibold bg-violet-50 p-2 rounded capitalize">
													{denuncia.motivo_otro}
												</p>
											</div>
										)}
									</div>
									<div className="mb-4">
										<h5 className="text-sm uppercase text-gray-500 font-medium mb-1">
											Fecha del incidente
										</h5>
										<div className="flex items-center">
											<span className="text-purple-500">
												<CalendarIcon />
											</span>
											<span className="text-gray-800">
												{formatDate(
													denuncia.fecha_incidente
												)}
											</span>
										</div>
									</div>
									<div>
										<h5 className="text-sm uppercase text-gray-500 font-medium mb-1">
											Descripción
										</h5>
										<div className="bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-32 overflow-y-auto text-gray-600 text-sm">
											{denuncia.descripcion ||
												"No se proporcionó descripción."}
										</div>
									</div>
								</div>
							</div>
							<div className="col-span-1">
								<div className="bg-white rounded-lg shadow-sm p-4 mb-5 border-l-4 border-green-500">
									<h4 className="flex items-center text-lg font-semibold text-green-700 mb-3">
										<HistorialIcon />
										Historial
									</h4>
									<div className="relative pl-8 mt-4">
										<div className="absolute left-3 top-1 bottom-0 w-0.5 bg-green-200"></div>
										<div className="absolute left-2 top-0 w-3 h-3 rounded-full bg-green-500 transform -translate-x-1/2"></div>
										<div className="mb-6">
											<h6 className="text-sm font-semibold text-gray-800">
												Registrada
											</h6>
											<time className="text-xs text-gray-500">
												{formatDate(
													denuncia.fecha_registro
												)}
											</time>
											<p className="text-sm text-gray-600 mt-1">
												La denuncia fue registrada en el
												sistema.
											</p>
										</div>
										<div className="mb-4">
											<h6 className="text-sm font-semibold text-gray-800 capitalize">
												{denuncia.estado.replace(
													"_",
													" "
												)}
											</h6>
											<time className="text-xs text-gray-500">
												Estado actual
											</time>
											<p className="text-sm text-gray-600 mt-1">
												{getStatusDescription(
													denuncia.estado
												)}
											</p>
										</div>
									</div>
								</div>
								<div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-400">
									<h4 className="flex items-center text-lg font-semibold text-amber-700 mb-3">
										<CommentIcon />
										Comentario
									</h4>
									{isEditing ? (
										<div className="mb-4">
											<textarea
												value={commentValue || ""}
												onChange={(e) =>
													onCommentChange &&
													onCommentChange(
														denuncia.tracking_code,
														e.target.value
													)
												}
												className="w-full p-3 border border-amber-200 rounded-md bg-amber-50 focus:ring-2 focus:ring-amber-300 focus:border-amber-300 resize-none"
												rows={4}
												placeholder="Añade un comentario sobre esta denuncia..."
											/>
											<div className="flex justify-end mt-2 space-x-2">
												<button
													type="button"
													onClick={() =>
														onEdit(
															denuncia.tracking_code
														)
													}
													className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
												>
													Cancelar
												</button>
											</div>
										</div>
									) : (
										<p className="italic text-gray-600 bg-amber-50 p-3 rounded text-sm mb-4">
											{denuncia.seguimiento_comentario ||
												"No hay comentarios del administrador aún."}
										</p>
									)}
									<button
										type="button"
										onClick={() =>
											onDownload(denuncia.tracking_code)
										}
										disabled={isDownloading}
										className="w-full cursor-pointer flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-md shadow hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
									>
										{isDownloading ? (
											<Loader isBtn={true} />
										) : (
											<>
												<DownloadIcon />
												Descargar evidencias
											</>
										)}
									</button>
								</div>
							</div>
						</div>
						<div className="mt-6 flex justify-between items-center pt-4 border-t border-indigo-100">
							<button
								onClick={() => onClose(denuncia.tracking_code)}
								className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium"
								type="button"
							>
								<XIcon />
								Cerrar detalles
							</button>
							<div className="flex space-x-3">
								{!isEditing && (
									<button
										type="button"
										onClick={() =>
											onEdit(denuncia.tracking_code)
										}
										className="px-4 py-2 bg-white border cursor-pointer transition-all duration-300 ease-in-out border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Editar Denuncia
									</button>
								)}
								<button
									disabled={!isEditing}
									onClick={() =>
										onUpdate(denuncia.tracking_code)
									}
									className="px-4 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed bg-indigo-600 border cursor-pointer transition-all duration-300 ease-in-out border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Actualizar estado
								</button>
							</div>
						</div>
					</div>
				</div>
			</td>
		</tr>
	);
};

import { DenunciaRecibida } from "../../types";

interface ExpandedRecievedRowProps {
	denuncia: DenunciaRecibida;
	onClose: (tracking_code: string) => void;
}

export const ExpandedRecievedRow = ({
	denuncia,
	onClose,
}: ExpandedRecievedRowProps) => {
	return (
		<tr key={`details-${denuncia.tracking_code}`} className="bg-indigo-50">
			<td colSpan={6} className="px-6 py-4">
				<div className="animate-fadeIn">
					<h4 className="text-lg font-semibold mb-3">
						Detalles de la denuncia
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h5 className="font-semibold text-gray-600">
								Información del denunciante
							</h5>
							<ul className="mt-2 space-y-1 text-sm">
								<li>
									<span className="font-medium">Nombre:</span>{" "}
									{denuncia.denunciante_nombre}
								</li>
								<li>
									<span className="font-medium">DNI:</span>{" "}
									{denuncia.denunciante_dni}
								</li>
							</ul>
						</div>
						<div>
							<h5 className="font-semibold text-gray-600">
								Información del denunciado
							</h5>
							<ul className="mt-2 space-y-1 text-sm">
								<li>
									<span className="font-medium">Nombre:</span>{" "}
									{denuncia.denunciado_nombre}
								</li>
								<li>
									<span className="font-medium">DNI:</span>{" "}
									{denuncia.denunciado_dni}
								</li>
							</ul>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
						<div>
							<h5 className="font-semibold text-gray-600">
								Información de la denuncia
							</h5>
							<ul className="mt-2 space-y-1 text-sm">
								<li>
									<span className="font-medium">
										Fecha del incidente:
									</span>{" "}
									{denuncia.fecha_incidente}
								</li>
								<li>
									<span className="font-medium">
										Descripción brindada:
									</span>{" "}
									{denuncia.descripcion}
								</li>
							</ul>
						</div>
					</div>
					<div>
						{/* acá debe ir un mejor historial */}
						<h5 className="font-semibold text-gray-600">
							Historial de la denuncia
						</h5>
						<p className="text-sm text-gray-500 mt-2">
							La denuncia fue registrada el{" "}
							{new Date(
								denuncia.fecha_registro
							).toLocaleDateString()}{" "}
							y actualmente se encuentra en estado "
							{denuncia.estado.replace("_", " ")}
							".
						</p>
					</div>
					<div className="mt-4 flex justify-end">
						<button
							onClick={() => onClose(denuncia.tracking_code)}
							className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
						>
							Cerrar detalles
						</button>
					</div>
				</div>
			</td>
		</tr>
	);
};

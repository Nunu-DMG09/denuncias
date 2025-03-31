import { DenunciaRecibida } from "../../types";
import { getStatusColor } from "../../utils";

interface RecievedRowsProps {
	denuncia: DenunciaRecibida;
	isExpanded: boolean;
	onToggle: (tracking_code: string) => void;
}
export const RecievedRows = ({
	denuncia,
	isExpanded,
	onToggle,
}: RecievedRowsProps) => {
	return (
		<tr className="hover:bg-gray-50 transition duration-150">
			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				{denuncia.tracking_code}
			</td>
			<td className="px-6 py-4">
				<div className="text-sm font-medium text-gray-900">
					{denuncia.motivo}
				</div>
				<div className="text-sm text-gray-500 truncate max-w-xs">
					Contra: {denuncia.denunciado_nombre}
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{new Date(denuncia.fecha_registro).toLocaleDateString()}
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<span
					className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(denuncia.estado)}`}
				>
					{denuncia.estado.replace("_", " ")}
				</span>
			</td>
			<td className="px-6 capitalize py-4 whitespace-nowrap text-sm text-gray-500">
				{denuncia.denunciante_nombre}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
				<div className="flex space-x-2 justify-center items-center">
					<button
						onClick={() => onToggle(denuncia.tracking_code)}
						className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-100 transition duration-300 ease-in-out flex items-center cursor-pointer"
					>
						<i
							className={`fas ${isExpanded ? "fa-eye-slash" : "fa-eye"} mr-1.5`}
						></i>
						{isExpanded ? "Ocultar" : "Detalles"}
					</button>
				</div>
			</td>
		</tr>
	);
};

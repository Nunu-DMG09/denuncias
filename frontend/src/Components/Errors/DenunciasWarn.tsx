import { DocumentIcon } from "../Icons";

export const DenunciasWarn = () => {
	return (
		<div className="bg-white rounded-lg shadow p-8 text-center">
			<div className="text-gray-600 mb-4">
				<DocumentIcon />
			</div>
			<h3 className="text-lg font-medium text-gray-900">
				No hay denuncias disponibles
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				No se encontraron denuncias registradas en el sistema
				actualmente.
			</p>
		</div>
	);
};

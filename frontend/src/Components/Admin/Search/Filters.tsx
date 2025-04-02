import { Motivo } from "../../../types";
import { CheckIcon, ResetIcon } from "../../Icons";

interface FilterProps {
	fechaFilter: string;
	motivoFilter: string;
	estadoFilter: Record<string, boolean>;
	handleFechaFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleMotivoFIlterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	handleEstadoFilterChange: (estado: string, value: boolean) => void;
	applyFilters: () => void;
	clearFilters: () => void;
	motivos?: Motivo[];
}

export const Filters = ({
	fechaFilter,
	motivoFilter,
	estadoFilter,
	handleFechaFilterChange,
	handleMotivoFIlterChange,
	handleEstadoFilterChange,
	applyFilters,
	clearFilters,
	motivos = [],
}: FilterProps) => {
	return (
		<div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sticky top-4">
			<h3 className="text-lg font-medium text-gray-800 mb-5 flex items-center border-b pb-2">
				Filtrar resultados
			</h3>
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Fecha de denuncia
					</label>
					<div className="space-y-2">
						<input
							type="date"
							className="w-full outline-none p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
							value={fechaFilter}
							onChange={handleFechaFilterChange}
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Motivo de denuncia
					</label>
					<select
						className="w-full outline-none p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
						value={motivoFilter}
						onChange={handleMotivoFIlterChange}
					>
						<option value="">Seleccione un motivo</option>
						{motivos.map((motivo) => (
							<option key={motivo.id} value={motivo.id}>
								{motivo.nombre}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Estado de denuncia
					</label>
					<div className="space-y-1">
						<label className="flex cursor-pointer items-center text-sm">
							<input
								type="checkbox"
								className="form-checkbox h-4 w-4 text-indigo-600"
								checked={estadoFilter.registrado}
								onChange={(e) => {
									handleEstadoFilterChange(
										"registrado",
										e.target.checked
									);
								}}
							/>
							<span className="ml-2">Registrada</span>
						</label>
						<label className="flex cursor-pointer items-center text-sm">
							<input
								type="checkbox"
								className="form-checkbox h-4 w-4 text-indigo-600"
								checked={estadoFilter.recibida}
								onChange={(e) => {
									handleEstadoFilterChange(
										"recibida",
										e.target.checked
									);
								}}
							/>
							<span className="ml-2">Recibida</span>
						</label>
						<label className="flex cursor-pointer items-center text-sm">
							<input
								type="checkbox"
								className="form-checkbox h-4 w-4 text-indigo-600"
								checked={estadoFilter.en_proceso}
								onChange={(e) => {
									handleEstadoFilterChange(
										"en_proceso",
										e.target.checked
									);
								}}
							/>
							<span className="ml-2">En proceso</span>
						</label>
						<label className="flex cursor-pointer items-center text-sm">
							<input
								type="checkbox"
								className="form-checkbox h-4 w-4 text-indigo-600"
								checked={estadoFilter.resuelto}
								onChange={(e) => {
									handleEstadoFilterChange(
										"resuelto",
										e.target.checked
									);
								}}
							/>
							<span className="ml-2">Resuelto</span>
						</label>
						<label className="flex cursor-pointer items-center text-sm">
							<input
								type="checkbox"
								className="form-checkbox h-4 w-4 text-indigo-600"
								checked={estadoFilter.rechazado}
								onChange={(e) => {
									handleEstadoFilterChange(
										"rechazado",
										e.target.checked
									);
								}}
							/>
							<span className="ml-2">Rechazado</span>
						</label>
					</div>
				</div>
				<div className="pt-4 border-t">
					<button
						className="w-full cursor-pointer bg-(--primary-color) text-white py-2 px-4 rounded hover:bg-(--secondary-color) transition-all duration-300 flex items-center justify-center"
						onClick={applyFilters}
					>
						<CheckIcon />
						Aplicar filtros
					</button>
					<button
						className="w-full cursor-pointer mt-2 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
						onClick={clearFilters}
					>
						<ResetIcon />
						Limpiar filtros
					</button>
				</div>
			</div>
		</div>
	);
};

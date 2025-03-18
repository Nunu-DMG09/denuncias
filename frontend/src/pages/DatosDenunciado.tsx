import { useDenunciante } from "../hooks/useDenunciante";
import { useFormContext } from "../hooks/useFormContext";

export const DatosDenunciado = () => {
	const { tipoDocumento, handleTipoDocumento } = useDenunciante();
	const { formData, updateDenunciado } = useFormContext();
	const { denunciado } = formData;
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<label className="mb-2" htmlFor="tipo-documento">
					Tipo de Documento de Identidad del Denunciado
					<span className="text-red-500 font-black text-xl">*</span>
				</label>
				<select
					name="tipo-documento"
					id="tipo-documento"
					value={denunciado.tipo_documento}
					onChange={(e) =>
						updateDenunciado({ tipo_documento: e.target.value })
					}
					className="w-full cursor-pointer p-[1em] border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent text-(--secondary-color) focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out"
				>
					<option value="" disabled className="text-(--gray-light)">
						Seleccione una opción
					</option>
					<option value="dni">DNI</option>
					<option value="ruc">RUC</option>
					<option value="carnet-extranjeria">
						Carnet de Extranjería
					</option>
				</select>
			</div>
			<div className="space-y-2 relative">
				<input
					type="text"
					className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
					placeholder=" "
					value={denunciado.numero_documento}
					onChange={(e) =>
						updateDenunciado({ numero_documento: e.target.value })
					}
				/>
				<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
					Número de Documento de Identidad del Denunciado
					<span className="text-red-500 font-black">*</span>
				</label>
			</div>
			<div className="space-y-2 relative">
				<input
					type="text"
					className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
					placeholder=" "
				/>
				<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
					Nombre del Denunciado
				</label>
			</div>
			{denunciado.tipo_documento === "RUC" && (
				<div className="space-y-2">
					<label
						className="block text-sm font-medium text-gray-700"
						htmlFor="representante-legal"
					>
						Representante Legal
					</label>
					<input
						id="representante-legal"
						type="text"
						value={denunciado.representante_legal}
						onChange={(e) =>
							updateDenunciado({
								representante_legal: e.target.value,
							})
						}
						className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Nombre del representante legal"
					/>
				</div>
			)}
			{denunciado.tipo_documento === "RUC" && (
				<div className="space-y-2">
					<label
						className="block text-sm font-medium text-gray-700"
						htmlFor="razon-social"
					>
						Razón Social
					</label>
					<input
						id="razon-social"
						type="text"
						value={denunciado.razon_social}
						onChange={(e) =>
							updateDenunciado({ razon_social: e.target.value })
						}
						className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Razón social de la empresa"
					/>
				</div>
			)}
			<div className="space-y-2 relative">
				<input
					type="text"
					className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
					placeholder=" "
					value={denunciado.cargo}
					onChange={(e) =>
						updateDenunciado({ cargo: e.target.value })
					}
				/>
				<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
					Cargo del Denunciado
				</label>
			</div>
		</div>
	);
};

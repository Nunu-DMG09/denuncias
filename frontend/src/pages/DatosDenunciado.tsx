import { useDenunciante } from "../hooks/useDenunciante";

export const DatosDenunciado = () => {
    const {
        tipoDocumento,
        handleTipoDocumento
    } = useDenunciante();
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
					value={tipoDocumento}
					onChange={(e) => handleTipoDocumento(e.target.value)}
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
			<div className="space-y-2 relative">
				<input
					type="text"
					className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
					placeholder=" "
				/>
				<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
					Representante Legal del Denunciado
				</label>
			</div>
			<div className="space-y-2 relative">
				<input
					type="text"
					className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
					placeholder=" "
				/>
				<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
					Cargo del Denunciado
				</label>
			</div>
		</div>
	);
};

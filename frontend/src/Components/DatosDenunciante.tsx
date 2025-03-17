import { useDenunciante } from "../hooks/useDenunciante";
export const DatosDenunciante = () => {
	const { tipoDatos, handleTipoDatos } = useDenunciante();
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h3 className="font-medium text-gray-900">
					Identificación del denunciante
				</h3>
				<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
					<input
						type="radio"
						name="datos"
						id={`datos-personales`}
						className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
						checked={tipoDatos === "datos-personales"}
						onChange={() => handleTipoDatos("datos-personales")}
					/>
					<label
						htmlFor={`datos-personales`}
						className="flex-1 cursor-pointer"
					>
						<span className="font-medium text-gray-700">
							Denuncia con datos personales
						</span>
						<p className="text-gray-500 text-sm mt-1">
							Si eliges esta opción, los responsables de procesar
							tu denuncia recibirán tus datos y podrás recibir
							actualizaciones, además, podrás solicitar medidas de
							protección.
						</p>
					</label>
				</div>
				<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
					<input
						type="radio"
						name="datos"
						id={`anónimo`}
						className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
						checked={tipoDatos === "anonimo"}
						onChange={() => handleTipoDatos("anonimo")}
					/>
					<label
						htmlFor={`anónimo`}
						className="flex-1 cursor-pointer"
					>
						<span className="font-medium text-gray-700">
							Denuncia anónima
						</span>
						<p className="text-gray-500 text-sm mt-1">
							Eligiendo esta alternativa, nadie conocerá tu
							identifad, pero tampoco podrás añadir información a
							tu denuncia, recibir notificaciones sobre tu avance,
							ni pedir medidas de protección.
						</p>
					</label>
				</div>
			</div>
			{tipoDatos === "datos-personales" && (
				<div className="space-y-6">
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Nombre del Denunciante
						</label>
					</div>
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Dirección del Denunciante
						</label>
					</div>
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Teléfono del Denunciante
						</label>
					</div>
				</div>
			)}
		</div>
	);
};

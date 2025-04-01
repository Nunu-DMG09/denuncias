import { Loader } from "../../Components/Loaders/Loader";
import { useSearchDenuncia } from "../../hooks/Admin/Denuncias/useSearchDenuncia";
export const SearchDenuncia = () => {
	const {
		numeroDocumento,
		tipoDocumento,
		handleDocumentoChange,
		handleName,
		nombre,
		handleTipoDocumento,
		error,
		isLoading,
		denunciaData,
		handleSearchClick
	} = useSearchDenuncia();
	return (
		<div className="container mx-auto my-8 px-4">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Buscar denuncia
			</h2>
			<div className="space-y-8 max-w-3xl my-0 mx-auto">
				<div className="space-y-2">
					<label className="mb-2" htmlFor="tipo-documento">
						Tipo de Documento de Identidad del Denunciado
						<span className="text-red-500 font-black text-xl">
							*
						</span>
					</label>
					<select
						name="tipo-documento"
						id="tipo-documento"
						value={tipoDocumento}
						onChange={(e) => handleTipoDocumento(e.target.value)}
						className="w-full cursor-pointer p-[1em] border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent text-(--secondary-color) focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out"
					>
						<option
							value=""
							disabled
							className="text-(--gray-light)"
						>
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
						value={numeroDocumento}
						onChange={handleDocumentoChange}
						minLength={tipoDocumento === "dni" ? 8 : 11}
						maxLength={
							tipoDocumento === "dni"
								? 8
								: tipoDocumento === "ruc"
								? 11
								: 20
						}
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Nro de Documento de Identidad
						<span className="text-red-500 font-black">*</span>
					</label>
					{isLoading && <Loader isBtn={false} />}
				</div>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				{tipoDocumento !== "dni" && tipoDocumento !== "ruc" ? (
					""
				) : (
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							value={nombre}
							disabled={isLoading}
							readOnly={
								tipoDocumento === "dni" ||
								tipoDocumento === "ruc" ||
								tipoDocumento === ""
							}
							onChange={
								tipoDocumento === "dni" ||
								tipoDocumento === "ruc" ||
								tipoDocumento === ""
									? undefined
									: handleName
							}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Nombre del Denunciado
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
					</div>
				)}
				<div className="flex justify-center md:justify-end items-center">
					<button onClick={handleSearchClick} className="bg-(--primary-color) cursor-pointer text-white px-4 py-2 rounded hover:bg-(--secondary-color) transition duration-300 ease-in-out flex items-center">
						{isLoading ? (
							<Loader isBtn={true} />
						) : (
							<>
								<i className="fas fa-search mr-2"></i>
								Buscar
							</>
						)}
					</button>
				</div>
			</div>
			<p>
				{
					denunciaData.length === 0 && !isLoading
						? "No se encontraron resultados"
						: "Si se encontraron aña"
				}
			</p>
		</div>
	);
};

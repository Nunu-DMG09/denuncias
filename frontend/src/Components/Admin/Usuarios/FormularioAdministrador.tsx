import { Administrador } from "../../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios";
import { Loader } from "../../Loaders/Loader";
import useEditAdmin from "../../../hooks/Admin/useEditAdmin";

interface FormularioAdministradorProps {
	admin: Administrador | null;
	actionType: "password" | "state" | "role";
	onCancel: () => void;
}

const FormularioAdministrador: React.FC<FormularioAdministradorProps> = ({
	admin,
	actionType,
	onCancel,
}) => {
	// Toda la lógica está ahora en el hook
	const { formData, isLoading, error, updateField, handleSubmit } =
		useEditAdmin(admin, onCancel, actionType);

	// Renderizado condicional según el tipo de acción
	const renderActionForm = () => {
		switch (actionType) {
			case "password":
				return (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						className="p-4 bg-blue-50 rounded-md"
					>
						<h4 className="text-sm font-medium text-blue-800 mb-3">
							Cambiar contraseña
						</h4>
						{error && (
							<p className="text-red-600 text-xs mb-2">{error}</p>
						)}
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex-1">
								<input
									type="password"
									placeholder="Nueva contraseña"
									value={formData.password}
									onChange={(e) =>
										updateField("password", e.target.value)
									}
									className="w-full p-2 border border-blue-300 rounded"
									disabled={isLoading}
									required
								/>
							</div>
							<div className="flex-1">
								<input
									type="password"
									placeholder="Confirmar contraseña"
									// Nota: En el hook debemos agregar un campo confirmPassword
									// Por ahora lo dejo aquí para mantener la interfaz de usuario
									onChange={(e) => {
										/* Manejar en el hook */
									}}
									className="w-full p-2 border border-blue-300 rounded"
									disabled={isLoading}
									required
								/>
							</div>
							<div className="flex gap-2">
								<button
									type="submit"
									className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
									disabled={isLoading}
								>
									{isLoading ? (
										<Loader isBtn={true} />
									) : (
										"Guardar"
									)}
								</button>
								<button
									type="button"
									onClick={onCancel}
									className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
									disabled={isLoading}
								>
									Cancelar
								</button>
							</div>
						</div>
					</form>
				);

			case "state":
				return (
					<div
						className={`p-4 ${
							admin.estado === "activo"
								? "bg-red-50"
								: "bg-green-50"
						} rounded-md`}
					>
						<h4
							className={`text-sm font-medium ${
								admin.estado === "activo"
									? "text-red-800"
									: "text-green-800"
							} mb-3`}
						>
							{admin.estado === "activo"
								? "Desactivar"
								: "Activar"}{" "}
							administrador
						</h4>

						{/* Campo para el motivo */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Motivo <span className="text-red-500">*</span>
							</label>
							<textarea
								value={formData.motivo || ""}
								onChange={(e) =>
									updateField("motivo", e.target.value)
								}
								className={`w-full p-2 border rounded ${
									admin.estado === "activo"
										? "border-red-300"
										: "border-green-300"
								}`}
								placeholder={`Indique el motivo para ${
									admin.estado === "activo"
										? "desactivar"
										: "activar"
								} al administrador`}
								required
								rows={3}
								disabled={isLoading}
							/>
						</div>

						{error && (
							<p className="text-red-600 text-xs mb-2">{error}</p>
						)}

						<div className="flex gap-2 mt-4">
							<button
								onClick={() => handleSubmit()}
								className={`${
									admin.estado === "activo"
										? "bg-red-600 hover:bg-red-700"
										: "bg-green-600 hover:bg-green-700"
								} text-white px-4 py-2 rounded transition-colors`}
								disabled={isLoading || !formData.motivo?.trim()}
							>
								{isLoading ? (
									<Loader isBtn={true} />
								) : admin.estado === "activo" ? (
									"Desactivar"
								) : (
									"Activar"
								)}
							</button>
							<button
								onClick={onCancel}
								className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
								disabled={isLoading}
							>
								Cancelar
							</button>
						</div>
					</div>
				);

			case "role":
				return (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						className="p-4 bg-purple-50 rounded-md"
					>
						<h4 className="text-sm font-medium text-purple-800 mb-3">
							Cambiar categoría
						</h4>
						<div className="flex flex-col gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nueva categoría
								</label>
								<select
									value={formData.categoria}
									onChange={(e) =>
										updateField("categoria", e.target.value)
									}
									className="w-full p-2 border border-purple-300 rounded"
									disabled={isLoading}
								>
									<option value="admin">Administrador</option>
									<option value="super_admin">
										Super Administrador
									</option>
								</select>
							</div>

							{/* Campo para el motivo */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Motivo del cambio{" "}
									<span className="text-red-500">*</span>
								</label>
								<textarea
									value={formData.motivo || ""}
									onChange={(e) =>
										updateField("motivo", e.target.value)
									}
									className="w-full p-2 border border-purple-300 rounded"
									placeholder="Indique el motivo para cambiar la categoría"
									required
									rows={3}
									disabled={isLoading}
								/>
							</div>

							{error && (
								<p className="text-red-600 text-xs mb-2">
									{error}
								</p>
							)}

							<div className="flex gap-2 mt-2">
								<button
									type="submit"
									className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
									disabled={
										isLoading ||
										formData.categoria ===
											admin.categoria ||
										!formData.motivo?.trim()
									}
								>
									{isLoading ? (
										<Loader isBtn={true} />
									) : (
										"Guardar"
									)}
								</button>
								<button
									type="button"
									onClick={onCancel}
									className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
									disabled={isLoading}
								>
									Cancelar
								</button>
							</div>
						</div>
					</form>
				);

			default:
				return null;
		}
	};

	return (
		<div className="animate__animated animate__fadeIn">
			{renderActionForm()}
		</div>
	);
};

export default FormularioAdministrador;

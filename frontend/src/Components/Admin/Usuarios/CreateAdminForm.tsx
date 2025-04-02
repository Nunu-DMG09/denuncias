import { Loader } from "../../Loaders/Loader";
import { useEditAdmin } from "../../../hooks/Admin/useEditAdmin";

interface CreateAdminFormProps {
	onCancel: () => void;
	onCreate: () => void;
}
export const CreateAdminForm: React.FC<CreateAdminFormProps> = ({
	onCancel,
	onCreate,
}) => {
	const {
		formData,
		isLoading,
		error,
		updateField,
		handleDNIChange,
		handleSubmit,
	} = useEditAdmin(null, onCreate, "create");
	return (
		<div className="animate__animated animate__fadeIn">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
			>
				<h4 className="text-lg font-medium text-gray-80 mb-4">
					Crear nuevo administrador
				</h4>
				{error && (
					<div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
						{error}
					</div>
				)}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							DNI <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={formData.dni_admin}
							onChange={(e) => handleDNIChange(e.target.value)}
							className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Ingrese el DNI (8 dígitos)"
							maxLength={8}
							disabled={isLoading}
							required
						/>
					</div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombres y Apellidos <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.nombres}
                                onChange={(e) => updateField("nombres", e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nombres completos"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Mínimo 8 caracteres"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirme la contraseña"
                            disabled={isLoading}
                            required
                        />
                    </div>
				</div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.categoria}
                        onChange={(e) => updateField("categoria", e.target.value as "admin" | "super_admin")}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    >
                        <option value="admin">Administrador</option>
                        <option value="super_admin">Super Administrador</option>
                    </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader isBtn={true} /> : "Crear Administrador"}
                    </button>
                </div>
			</form>
		</div>
	);
};

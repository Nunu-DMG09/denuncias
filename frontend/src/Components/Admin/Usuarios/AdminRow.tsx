import { Administrador } from "../../../pages/Admin/AdministrarUsuarios/AdministrarUsuarios";
import { getEstadoColor, getEstadoColorBtn, getEstadoIcon, getStatusColor } from "../../../utils";

interface AdminRowProps {
    admin: Administrador;
    expandedRow: string | null;
    toggleExpand: (dni: string, action: "password" | "state" | "role") => void;
}

export const AdminRow = ({ expandedRow, admin, toggleExpand } : AdminRowProps) => {
	<tr
		className={`hover:bg-gray-50 ${
			expandedRow === admin.dni_admin ? "bg-gray-50 border-b-0" : ""
		}`}
	>
		<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
			{admin.dni_admin}
		</td>
		<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
			{admin.nombres}
		</td>
		<td className="px-6 py-4 whitespace-nowrap text-sm">
			<span
				className={`capitalize px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(admin.categoria)}`}
			>
				{admin.categoria.replace("_", " ")} 
			</span>
		</td>
		<td className="px-6 py-4 whitespace-nowrap text-sm">
			<span
				className={`capitalize px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(admin.estado)}`}
			>
				{admin.estado}
			</span>
		</td>
		<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
			<div className="flex flex-wrap items-center gap-2">
				<button
					onClick={() => toggleExpand(admin.dni_admin, "password")}
					className="flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow group overflow-hidden"
					aria-label="Cambiar contraseña"
				>
					<span className="flex items-center justify-center w-9 h-9">
						<i className="fas fa-key text-sm"></i>
					</span>
					<span className="pr-3 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
						Contraseña
					</span>
				</button>
				<button
					onClick={() => toggleExpand(admin.dni_admin, "state")}
					className={`flex items-center justify-center rounded-full transition-all duration-300 shadow-sm hover:shadow group overflow-hidden ${getEstadoColorBtn(admin.estado)}`}
					aria-label="Cambiar estado"
				>
					<span className="flex items-center justify-center w-9 h-9">
						<i
							className={`fas ${getEstadoIcon(admin.estado)} text-sm`}
						></i>
					</span>
					<span className="pr-3 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
						{admin.estado === "activo" ? "Desactivar" : "Activar"}
					</span>
				</button>
				<button
					onClick={() => toggleExpand(admin.dni_admin, "role")}
					className="flex items-center justify-center rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-300 shadow-sm hover:shadow group overflow-hidden"
					aria-label="Cambiar categoría"
				>
					<span className="flex items-center justify-center w-9 h-9">
						<i className="fas fa-tags text-sm"></i>
					</span>
					<span className="pr-3 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
						Categoría
					</span>
				</button>
			</div>
		</td>
	</tr>;
};

import { Link } from "react-router";

export const Unauthorized = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-200">
			<div className="text-center p-8 bg-white rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-red-500 mb-4">
					Acceso denegado
				</h1>
				<p className="text-gray-600 mb-6">
					No tienes permisos para acceder a esta página.
				</p>
				<div className="flex justify-center space-x-4">
					<Link
						to="/"
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
					>
						Ir al inicio
					</Link>
					<Link
						to="/admin/dashboard"
						className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
					>
						Volver al panel
					</Link>
				</div>
			</div>
		</div>
	);
};

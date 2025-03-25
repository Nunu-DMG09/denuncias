import { Link } from "react-router";

export const Unauthorized = () => {
	return (
		<div className="container mx-auto my-30 px-4 py-6 max-w-2xl">
			<div className="text-center p-8 bg-white rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-red-500 mb-4">
					Acceso denegado
				</h1>
				<p className="text-gray-600 mb-6">
					No tienes permisos para acceder a esta página.
				</p>
				<div className="flex justify-center space-x-4">
					<Link
						to="/admin/dashboard"
						className="bg-gray-700 hover:bg-(--gray) transition-all duration-300 ease-in-out text-white p-4 rounded w-full"
					>
						Volver al panel
					</Link>
				</div>
			</div>
		</div>
	);
};

import { Link } from "react-router";

export const DashboardAdmin = () => {
	return (
		<div className="container mx-auto my-10 px-4 py-6 max-w-5xl">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Panel de Administración
			</h2>
            <main className="grid grid-cols-1 md:grid-cols-3 gap-14 group">
                <Link
                    to="/admin-dashboard"
                    className="col-span-1 rounded-2xl text-(--secondary-color) shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d] p-8 text-center flex flex-col items-center justify-center gap-5 transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 hover:text-(--primary-color) hover:scale-105"
                >
                    <h1 className="text-xl font-(family-name:--titles) font-semibold">
                        Administrar Usuarios
                    </h1>
                    <i className="fa-duotone fa-solid fa-user-tie text-5xl"></i>
                </Link>
                <Link
                    className="col-span-1 rounded-2xl text-(--secondary-color) shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d] p-8 text-center flex flex-col items-center justify-center gap-5 transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 hover:text-(--primary-color) hover:scale-105"
                    to={"/admin-dashboard"}
                >
                    <h1 className="text-xl font-(family-name:--titles) font-semibold">
                        Administrar Denuncias
                    </h1>
                    
                    <i className="fa-duotone fa-solid fa-circle-exclamation text-5xl"></i>
                </Link>
                <Link
                    className="col-span-1 rounded-2xl text-(--secondary-color) shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d] p-8 text-center flex flex-col items-center justify-center gap-5 transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 hover:text-(--primary-color) hover:scale-105"
                    to={"/admin-dashboard"}
                >
                    <h1 className="text-xl font-(family-name:--titles) font-semibold">
                        Historial de Administradores
                    </h1>
                    <i className="fa-duotone fa-solid fa-rectangle-history-circle-user text-5xl"></i>
                </Link>
            </main>
		</div>
	);
};

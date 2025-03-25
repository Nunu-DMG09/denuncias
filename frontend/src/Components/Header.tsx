const logo = "/logo.jpeg";
import { Link, useLocation } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";

const Header = () => {
	const { logout } = useAuthContext();
	const location = useLocation();
	const isFormPage = location.pathname === "/";
	const isAdminSection = location.pathname.includes("/admin");

	return (
		<header className="header shadow-md w-full bg-white py-4 px-4">
			<nav className="nav-container d-flex justify-between items-center">
				<div className="nav-content flex items-center justify-between w-full">
					<Link
						className="logo-section flex items-center gap-4 font-(family-name:--titles)"
						to="/"
					>
						<img
							alt="Logo Municipal"
							className="nav-logo w-12 h-16 object-contain"
							src={logo}
						/>
						<h3 className="font-semibold flex flex-col text-sm md:text-lg text-gray-700">
							<span>Municipalidad Distrital de</span>
							<span>José Leonardo Ortiz</span>
						</h3>
					</Link>
					{isAdminSection ? (
						<button
							onClick={logout}
							className="bg-red-400 text-sm md:text-base text-center text-white font-semibold px-4 py-3 rounded-lg ml-17 cursor-pointer hover:scale-110 hover:bg-red-800 transition-all ease-in-out duration-300"
						>
							Cerrar Sesión
						</button>
					) : isFormPage ? (
						<Link
							to="/tracking-denuncia"
							className="bg-(--secondary-color) text-sm md:text-base text-center text-white font-semibold px-4 py-3 rounded-lg ml-17 cursor-pointer hover:scale-110 hover:bg-(--primary-color) transition-all ease-in-out duration-300"
						>
							Ver Estado de denuncia
						</Link>
					) : (
						<Link
							to="/"
							className="bg-(--secondary-color) text-center text-white font-semibold px-4 py-3 rounded-lg ml-17 cursor-pointer hover:scale-110 hover:bg-(--primary-color) transition-all ease-in-out duration-300"
						>
							Volver al Formulario
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;

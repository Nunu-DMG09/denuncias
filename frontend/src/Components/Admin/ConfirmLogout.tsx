import { useAuthContext } from "../../hooks/useAuthContext";

interface ConfirmLogoutProps {
	onCancel: () => void;
}

export const ConfirmLogout: React.FC<ConfirmLogoutProps> = ({ onCancel }) => {
	const { confirmLogout } = useAuthContext();
	const handleLogout = () => {
		confirmLogout("si");
	};
	return (
		<div className="fixed inset-0 backdrop-blur-sm backdrop-saturate-100 bg-[#3a46500d] flex justify-center items-center z-50 animate__animated animate__fadeIn">
			<div className="bg-white p-8 rounded-lg w-96 shadow-xl animate__animated animate__zoomIn animate__faster">
				<h2 className="text-xl font-bold mb-4 text-center">
					¿Estás seguro de cerrar sesión?
				</h2>
				<div className="flex justify-evenly items-center">
					<button
						className="bg-(--primary-color) text-white p-5 rounded-sm hover:bg-(--secondary-color) cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out"
						onClick={onCancel}
					>
						Cancelar
					</button>
					<button
						className="bg-transparent border-3 border-red-400 text-red-400 p-4 rounded-sm cursor-pointer hover:bg-red-400 hover:text-white transition-all duration-300 ease-in-out"
						onClick={handleLogout}
					>
						Cerrar sesión
					</button>
				</div>
			</div>
		</div>
	);
};

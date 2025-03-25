import { useAuthContext } from "../../hooks/useAuthContext";

interface ConfirmLogoutProps {
    onCancel: () => void;
}

export const ConfirmLogout: React.FC<ConfirmLogoutProps> = ({ onCancel }) => {
	const { confirmLogout } = useAuthContext();
    const handleLogout = () => {
        confirmLogout("si");
    }
	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 animate__animated animate__fadeIn">
			<div className="bg-white p-8 rounded-lg w-96 shadow-xl animate__animated animate__zoomIn animate__faster">
				<h2 className="text-xl font-bold mb-4">
					¿Estás seguro de cerrar sesión?
				</h2>
				<div className="flex justify-end">
					<button className="btn btn-secondary mr-4" onClick={onCancel}>Cancelar</button>
					<button
						className="btn btn-primary"
						onClick={handleLogout}
					>
						Cerrar sesión
					</button>
				</div>
			</div>
		</div>
	);
};

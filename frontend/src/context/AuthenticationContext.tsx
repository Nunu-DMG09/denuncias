import axios from "axios";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthContextProps {
	isAuthenticated: boolean;
	user: User | null;
	login: (dni: string, password: string) => Promise<boolean>;
	logout: () => void;
	confirmLogout: (confirmation: string) => void;
	loading: boolean;
}

interface User {
	dni_admin: string;
	categoria: string;
	nombres: string;
	estado: "activo" | "inactivo";
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		if (token) {
			try {
				const base64Url = token.split(".")[1];
				const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
				const payload = JSON.parse(window.atob(base64));

				if (payload.exp > Date.now() / 1000) {
					setIsAuthenticated(true);
					setUser({
						dni_admin: payload.dni_admin,
						categoria: payload.categoria,
						nombres: payload.nombres || "Administrador",
						estado: payload.estado || "activo",
					});
				} else {
					localStorage.removeItem("auth_token");
				}
			} catch (error) {
				console.error(error);
				localStorage.removeItem("auth_token");
			}
		}
		setLoading(false);
	}, []);

	const login = async (dni: string, password: string) => {
		try {
			const response = await axios.post(
				"http://localhost/denuncias/backend/public/login",
				{
					dni_admin: dni,
					password: password,
				}
			);

			if (response.data.token) {
				localStorage.setItem("auth_token", response.data.token);
				const base64Url = response.data.token.split(".")[1];
				const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
				const payload = JSON.parse(window.atob(base64));
				setIsAuthenticated(true);
				setUser({
					dni_admin: payload.dni_admin,
					categoria: payload.categoria,
					nombres: payload.nombres || "Administrador",
					estado: payload.estado || "activo",
				});
				return true;
			}
			return false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.error;
				if (errorMessage) {
					throw new Error(errorMessage);
				}
			}
			throw new Error("Error al iniciar sesión");
		}
	};
	const confirmLogout = (confirmation: string) => {
		if (confirmation === "si") {
			logout();
		}
	};
	const logout = () => {
		localStorage.removeItem("auth_token");
		setIsAuthenticated(false);
		setUser(null);
		navigate("/admin/login");
	};
	const checkUserInfo = async () => {
		try {
			const token = localStorage.getItem("auth_token");
			if (!token || !isAuthenticated) return;
			const response = await axios.get(
				"http://localhost/denuncias/backend/public/admin-info",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.forceLogout === true) {
				toast.error(
					"Tu sesión ha expirado o tu cuenta ha sido desactivada"
				);
				logout();
				return;
			}

			if (response.data.roleChanged && response.data.token) {
				localStorage.setItem("auth_token", response.data.token);
				setUser({
					dni_admin: response.data.user.dni_admin,
					categoria: response.data.user.categoria,
					nombres: response.data.user.nombres || "Administrador",
					estado: response.data.user.estado || "activo",
				});

				toast.info("Se ha actualizado tu información de usuario", {
					description: `Tu rol ha cambiado a ${
						response.data.user.categoria === "super_admin"
							? "Super Administrador"
							: "Administrador"
					}`,
				});
			}
		} catch (error) {
			console.error(
				"Error al verificar la información del usuario",
				error
			);
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 401) {
					if (error.response.data?.forceLogout) {
						toast.error(
							error.response.data?.error ||
								"Tu sesión ha expirado"
						);
						logout();
					}
				}
			}
		}
	};
	useEffect(() => {
		if (isAuthenticated) {
			checkUserInfo();
			const interval = setInterval(checkUserInfo, 30 * 1000);
			return () => clearInterval(interval);
		}
	}, [isAuthenticated]);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login,
				logout,
				loading,
				confirmLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

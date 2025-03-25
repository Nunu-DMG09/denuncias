import axios from "axios";
import {
	createContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useNavigate } from "react-router";

interface AuthContextProps {
	isAuthenticated: boolean;
	user: User | null;
	login: (dni: string, password: string) => Promise<boolean>;
	logout: () => void;
	loading: boolean;
}

interface User {
	dni_admin: string;
	categoria: string;
	nombres: string;
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
            const response = await axios.post('http://localhost/denuncias/backend/public/login', {
                dni_admin: dni,
                password: password
            })

            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token)
                const base64Url = response.data.token.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const payload = JSON.parse(window.atob(base64))
                setIsAuthenticated(true)
                setUser({
                    dni_admin: payload.dni_admin,
                    categoria: payload.categoria,
                    nombres: payload.nombres || 'Administrador'
                })
                return true
            }
            return false
        } catch (error) {
            console.error(error)
            return false
        }
    }
    const logout = () => {
        localStorage.removeItem('auth_token')
        setIsAuthenticated(false)
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
};

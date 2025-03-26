import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import { Loader } from "./Loaders/Loader";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	allowedRoles,
}) => {
	const { isAuthenticated, loading, user } = useAuthContext();
	const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader isBtn={false} />
        </div>
    }
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{from: location}} replace />
    }
    if (allowedRoles && user && !allowedRoles.includes(user.categoria)) {
        return <Navigate to="/unauthorized" replace />
    }
    return <>{children}</>;
};

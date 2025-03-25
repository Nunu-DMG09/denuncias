import { useContext } from "react";
import { AuthContext } from "../context/AuthenticationContext";
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error(
            "useAuthContext debe usarse dentro de un AuthProvider"
        );
    }
    return context;
}
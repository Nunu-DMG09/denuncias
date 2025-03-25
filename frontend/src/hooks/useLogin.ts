import { useEffect, useState } from "react";
import { useFormContext } from "./useFormContext";
import { getDNIData } from "../services/apisDocs";
import { toast } from "sonner";
export const useLogin = () => {
	const { formData } = useFormContext();
	const [numeroDocumento, setNumeroDocumento] = useState<string>(
		formData.denunciado.numero_documento || ""
	);
	const [nombre, setNombre] = useState<string>(
		formData.denunciado.nombre || ""
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    }
	const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const documentoValue = e.target.value;
		setNumeroDocumento(documentoValue);
	};
	const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setNombre(nameValue);
	};
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
    };
    useEffect(() => {
        const fetchDniData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const nombre = await getDNIData(numeroDocumento);
                if(nombre) {
                    setNombre(nombre);
                } else {
                    const errMsg = "No se encontraron datos con el DNI ingresado";
                    setError(errMsg);
                    toast.error(errMsg);
                }
            } catch (error) {
                console.error(error);
                setError("Ocurrió un error al buscar los datos del DNI");
                toast.error("Ocurrió un error al buscar los datos del DNI");
            } finally {
                setIsLoading(false);
            }
        }
        if(numeroDocumento.length === 8) {
            fetchDniData();
        }
    }, [numeroDocumento]);

    useEffect(() => {
        if (numeroDocumento.length === 8 && nombre && password.length >= 8) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [numeroDocumento, nombre, password]);

    return {
        numeroDocumento,
        nombre,
        isLoading,
        error,
        handleDocumentoChange,
        handleName,
        isVisible,
        toggleVisibility,
        isDisabled,
        handlePassword,
        password,
    }
};

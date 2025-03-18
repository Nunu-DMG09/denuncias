import { useEffect, useState } from "react";
import { toast } from "sonner";


export const useDenunciante = () => {
	const [tipoDatos, setTipoDatos] = useState<string>("datos-personales");
	const [tipoDocumento, setTipoDocumento] = useState("");
	const [sexo, setSexo] = useState<string>("");
	const [numeroDocumento, setNumeroDocumento] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleTipoDatos = (tipo: string) => {
		setTipoDatos(tipo);
	};
	const handleTipoDocumento = (tipo: string) => {
		setTipoDocumento(tipo);
		setNumeroDocumento("");
		setNombre("");
		setError(null);
	};

	const handleSexo = (sexo: string) => {
		setSexo(sexo);
	};

	const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const documentoValue = e.target.value;
		setNumeroDocumento(documentoValue);
	};

	const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setNombre(nameValue);
	};

	useEffect(() => {
		if (tipoDocumento === "dni" && numeroDocumento.length !== 8) {
			setNombre("");
		}
		if (tipoDocumento === "dni" && numeroDocumento.length === 8) {
			const fetchDniData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const response = await fetch(
						`http://localhost/denuncias/backend/public/api/dni/${numeroDocumento}`
					);
					if (!response.ok) {
						throw new Error(
							`Error: ${response.status} - ${response.statusText}`
						);
					}
					const data = await response.json();
					if (data && data.success && data.data) {
						const personaData = data.data;
						const nombre = `${personaData.apellido_paterno} ${personaData.apellido_materno}, ${personaData.nombres}`;
						setNombre(nombre);
					} else {
						const errMsg = "No se pudo obtener la información del DNI"
						setError(errMsg);
						toast.error(errMsg)
					}
				} catch (err) {
					console.error("Error al consultar DNI:", err);
					const errMsg = 'Error al consultar el DNI. Intente nuevamente.'
					setError(errMsg);
					toast.error(errMsg)
				} finally {
					setIsLoading(false);
				}
			};
			fetchDniData();
		}
		if (tipoDocumento === "ruc" && numeroDocumento.length !== 11) {
			setNombre("");
		}
		if (tipoDocumento === 'ruc' && numeroDocumento.length === 11) {
			const fetchRucData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const response = await fetch(
						`http://localhost/denuncias/backend/public/api/ruc/${numeroDocumento}`
					);
					if (!response.ok) {
						throw new Error(
							`Error: ${response.status} - ${response.statusText}`
						);
					}
					const data = await response.json();
					if (data && data.success && data.data) {
						const empresaData = data.data;
						const nombre = empresaData.nombre_o_razon_social;
						setNombre(nombre);
					} else {
						const errMsg = "No se pudo obtener la información del RUC"
						setError(errMsg);
						toast.error(errMsg)
					}
				} catch (err) {
					console.error("Error al consultar RUC:", err);
					const errMsg = 'Error al consultar el RUC. Intente nuevamente.'
					setError(errMsg);
					toast.error(errMsg)
				} finally {
					setIsLoading(false);
				}
			};
			fetchRucData();
		}
	}, [tipoDocumento, numeroDocumento]);

	return {
		tipoDatos,
		handleTipoDatos,
		tipoDocumento,
		handleTipoDocumento,
		sexo,
		handleSexo,
		numeroDocumento,
        handleDocumentoChange,
        nombre,
        setNombre,
        isLoading,
        error,
		handleName
	};
};

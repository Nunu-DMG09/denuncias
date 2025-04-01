import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormContext } from "./useFormContext";
import { getDNIData, getRUCData } from "../../services/apisDocs";


export const useDenunciante = () => {
	const { formData } = useFormContext();
	const [tipoDatos, setTipoDatos] = useState<string>(
		formData.es_anonimo ? "anonimo" : "datos-personales"
	);
	const [tipoDocumento, setTipoDocumento] = useState(
		formData.denunciante?.tipo_documento || ""
	);
	const [sexo, setSexo] = useState<string>(
		formData.denunciante?.sexo || ""
	);
	const [numeroDocumento, setNumeroDocumento] = useState<string>(
		formData.denunciante?.numero_documento || ""
	);
	const [nombre, setNombre] = useState<string>(
		formData.denunciante?.nombres || ""
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [duplicatedDocError, setDuplicatedDocError] = useState<string | null>(null);

	const checkDuplicatedDocument = (denuncianteDoc: string, denunciadoDoc: string) => {
		if (denuncianteDoc === denunciadoDoc) {
			setDuplicatedDocError("El número de documento del denunciante no puede ser igual al del denunciado.");
			return true
		} else {
			setDuplicatedDocError(null);
			return false
		}
	}
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
		if (tipoDocumento === "dni" && numeroDocumento.length === 8 && nombre) {
			return
		}
		if (tipoDocumento === "dni" && numeroDocumento.length === 8) {
			const fetchDniData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const nombre = await getDNIData(numeroDocumento);
					if (nombre) {
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
	}, [tipoDocumento, numeroDocumento]);

	useEffect(() => {
		if (tipoDocumento === "ruc" && numeroDocumento.length !== 11) {
			setNombre("");
		}
		if (tipoDocumento === "ruc" && numeroDocumento.length === 11 && nombre) {
			return
		}
		if (tipoDocumento === 'ruc' && numeroDocumento.length === 11) {
			const fetchRucData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const nombre = await getRUCData(numeroDocumento);
					if (nombre) {
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
		handleName,
		checkDuplicatedDocument,
		duplicatedDocError
	};
};

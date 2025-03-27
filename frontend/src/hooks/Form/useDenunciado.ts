import { useState, useEffect } from "react";
import { useFormContext } from "./useFormContext";
import { toast } from "sonner";
import { getRUCData, getDNIData } from "../../services/apisDocs";

export const useDenunciado = () => {
	const { formData } = useFormContext();

	const [tipoDocumento, setTipoDocumento] = useState<string>(
		formData.denunciado.tipo_documento || ""
	);
	const [numeroDocumento, setNumeroDocumento] = useState<string>(
		formData.denunciado.numero_documento || ""
	);
	const [nombre, setNombre] = useState<string>(
		formData.denunciado.nombre || ""
	);
	const [representanteLegal, setRepresentanteLegal] = useState<string>(
		formData.denunciado.representante_legal || ""
	);
	const [razonSocial, setRazonSocial] = useState<string>(
		formData.denunciado.razon_social || ""
	);
	const [cargo, setCargo] = useState<string>(formData.denunciado.cargo || "");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleTipoDocumento = (tipo: string) => {
		setTipoDocumento(tipo);
		setNumeroDocumento("");
		setNombre("");
		setError(null);
	};
	const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const documentoValue = e.target.value;
		setNumeroDocumento(documentoValue);
	};
	const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setNombre(nameValue);
	};

	const handleRepresentanteLegal = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const representanteLegalValue = e.target.value;
		setRepresentanteLegal(representanteLegalValue);
	};

	const handleRazonSocial = (e: React.ChangeEvent<HTMLInputElement>) => {
		const razonSocialValue = e.target.value;
		setRazonSocial(razonSocialValue);
	};

	const handleCargo = (e: React.ChangeEvent<HTMLInputElement>) => {
		const cargoValue = e.target.value;
		setCargo(cargoValue);
	};

	useEffect(() => {
		if (tipoDocumento === "dni" && numeroDocumento.length !== 8) {
			setNombre("");
		}
		if (tipoDocumento === "dni" && numeroDocumento.length === 8 && nombre) {
			return;
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
						const errMsg =
							"No se pudo obtener la información del DNI";
						setError(errMsg);
						toast.error(errMsg);
					}
				} catch (err) {
					console.error("Error al consultar DNI:", err);
					const errMsg =
						"Error al consultar el DNI. Intente nuevamente.";
					setError(errMsg);
					toast.error(errMsg);
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
		if (
			tipoDocumento === "ruc" &&
			numeroDocumento.length === 11 &&
			nombre
		) {
			return;
		}
		if (tipoDocumento === "ruc" && numeroDocumento.length === 11) {
			const fetchRucData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const nombre = await getRUCData(numeroDocumento);
					if (nombre) {
						setNombre(nombre);
					} else {
						const errMsg =
							"No se pudo obtener la información del RUC";
						setError(errMsg);
						toast.error(errMsg);
					}
				} catch (err) {
					console.error("Error al consultar RUC:", err);
					const errMsg =
						"Error al consultar el RUC. Intente nuevamente.";
					setError(errMsg);
					toast.error(errMsg);
				} finally {
					setIsLoading(false);
				}
			};
			fetchRucData();
		}
	}, [tipoDocumento, numeroDocumento]);

	return {
		tipoDocumento,
		numeroDocumento,
		nombre,
		representanteLegal,
		razonSocial,
		cargo,
		isLoading,
		error,
		handleTipoDocumento,
		handleDocumentoChange,
		handleName,
		handleRepresentanteLegal,
		handleRazonSocial,
		handleCargo,
	};
};

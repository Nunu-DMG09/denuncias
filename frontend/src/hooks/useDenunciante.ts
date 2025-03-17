import { useState } from "react";

export const useDenunciante = () => {
	const [tipoDatos, setTipoDatos] = useState<string>("datos-personales");
	const [tipoDocumento, setTipoDocumento] = useState("");
	const [sexo, setSexo] = useState<string>("");

	const handleTipoDatos = (tipo: string) => {
		setTipoDatos(tipo);
	};
	const handleTipoDocumento = (tipo: string) => {
		setTipoDocumento(tipo);
	}

	const handleSexo = (sexo: string) => {
		setSexo(sexo);
	}

	return { tipoDatos, handleTipoDatos, tipoDocumento, handleTipoDocumento, sexo, handleSexo };
};

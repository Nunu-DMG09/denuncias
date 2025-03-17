import { useState } from "react";

export const useDenunciante = () => {
	const [tipoDatos, setTipoDatos] = useState<string>("datos-personales");
	const handleTipoDatos = (tipo: string) => {
		setTipoDatos(tipo);
	};
	return { tipoDatos, handleTipoDatos };
};

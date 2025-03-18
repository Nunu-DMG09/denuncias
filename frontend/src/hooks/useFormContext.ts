import { useContext } from "react";
import { FormContext } from "../context/DenunciasContext";

export const useFormContext = () => {
	const context = useContext(FormContext);
	if (context === undefined) {
		throw new Error("useFormContext debe usarse dentro de un FormProvider");
	}
	return context;
};

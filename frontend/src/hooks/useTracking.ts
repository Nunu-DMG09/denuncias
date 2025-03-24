import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useFormContext } from "./useFormContext";
export const useTracking = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [trackingCode, setTrackingCode] = useState<string>(
		searchParams.get("codigo") || ""
	);
	const [displayTrackingCode, setDisplayTrackingCode] = useState<string>(
		searchParams.get("codigo") || ""
	);
	const {
		trackingData,
		trackingLoading,
		trackingError,
		resetTracking,
		consultarTracking,
	} = useFormContext();

	useEffect(() => {
		const codigo = searchParams.get("codigo");
		if (codigo && codigo.trim() !== "") {
			setTrackingCode(codigo);
			setDisplayTrackingCode(codigo);
			consultarTracking(codigo);
		}
		return () => resetTracking();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTrackingCode(e.target.value);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const success = await consultarTracking(trackingCode);
		if (success) {
			setSearchParams({ codigo: trackingCode });
			setDisplayTrackingCode(trackingCode);
		}
	};
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "registrado":
				return "bg-amber-100 text-amber-800 border-amber-500";
			case "en proceso":
			case "en_proceso":
				return "bg-blue-100 text-blue-800 border-blue-500";
			case "finalizado":
			case 'resuelto':
				return "bg-green-100 text-green-800 border-green-500";
			case "rechazado":
				return "bg-red-100 text-red-800 border-red-500";
			default:
				return "bg-gray-100 text-gray-800 border-gray-500";
		}
	};
	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case "registrado":
				return "fa-file-circle-check";
			case "en_proceso":
			case "en proceso":
				return "fa-clock";
			case "finalizado":
			case 'resuelto':
				return "fa-check-circle";
			case "rechazado":
				return "fa-times-circle";
			default:
				return "fa-circle-info";
		}
	};
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
	return {
		trackingCode,
		handleInputChange,
		handleSubmit,
		getStatusColor,
		getStatusIcon,
		trackingData,
		trackingLoading,
		trackingError,
        formatDate,
		displayTrackingCode
	};
};

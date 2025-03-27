import { useEffect, useState } from "react";
import { useFormContext } from "./useFormContext";
import { toast } from "sonner";

export const useDenuncias = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const { updateFormData, motivos } = useFormContext();
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const handleDate = (date: Date | null) => {
		setStartDate(date);
		if (date) {
			const formattedDate = date.toISOString().split("T")[0];
			updateFormData("fecha_incidente", formattedDate);
		} else {
			updateFormData("fecha_incidente", null);
		}
	};
	const copyToClipboard = (trackingCode: string) => {
		navigator.clipboard.writeText(trackingCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	useEffect(() => {
		if (motivos.length > 0) {
			setIsLoading(false);
			setError(null);
		}
		const timeoutId = setTimeout(() => {
			if (isLoading && motivos.length === 0) {
				setIsLoading(false);
				setError("No se pudieron cargar los motivos de denuncia.");
				toast.error("Error de carga", {
					description:
						"No se pudieron cargar los motivos de denuncia.",
				});
			}
		}, 10000); // 10 segundos de timeout

		return () => clearTimeout(timeoutId);
	}, [motivos, isLoading]);

	return {
		startDate,
		handleDate,
		copyToClipboard,
		copied,
		isLoading,
		error
	};
};

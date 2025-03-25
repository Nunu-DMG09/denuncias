import { useEffect, useState } from "react";
import { useFormContext } from "./useFormContext";

export const useDenuncias = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const { updateFormData, motivos } = useFormContext();
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
		} else {
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [motivos]);

	return {
		startDate,
		handleDate,
		copyToClipboard,
		copied,
		isLoading
	};
};

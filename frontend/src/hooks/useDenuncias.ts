import { useState } from "react";

export const useDenuncias = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [selectedReason, setSelectedReason] = useState<string | null>('');
	const handleDate = (date: Date | null) => {
		setStartDate(date);
	};
	const handleReason = (motivoName: string) => {
		setSelectedReason(motivoName);
	};
	return {
		startDate,
		selectedReason,
		handleDate,
		handleReason,
	};
};

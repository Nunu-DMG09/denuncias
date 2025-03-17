import { useState } from "react";

export const useDenuncias = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [selectedReason, setSelectedReason] = useState<number | null>(0);
	const handleDate = (date: Date | null) => {
		setStartDate(date);
	};
	const handleReason = (num: number) => {
		setSelectedReason(num);
	};
	return {
		startDate,
		selectedReason,
		handleDate,
		handleReason,
	};
};

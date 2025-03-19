import { useState } from "react";

export const useDenuncias = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const handleDate = (date: Date | null) => {
		setStartDate(date);
	};
	return {
		startDate,
		handleDate,
	};
};

import { useState } from "react";

export const useDenuncias = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [copied, setCopied] = useState(false);
	const handleDate = (date: Date | null) => {
		setStartDate(date);
	};
	const copyToClipboard = (trackingCode : string) => {
		navigator.clipboard.writeText(trackingCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return {
		startDate,
		handleDate,
		copyToClipboard,
		copied,
	};
};

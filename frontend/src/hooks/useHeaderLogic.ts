import { useCallback, useState } from "react";
import { useLocation } from "react-router";

export const useHeader = () => {
	const location = useLocation();
	const isFormPage = location.pathname === "/";
	const isAdminSection = location.pathname.includes("/admin") && !location.pathname.includes("/admin/login");
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const openLogoutModal = useCallback(() => {
		setShowLogoutModal(true);
	}, []);
	const closeLogoutModal = useCallback(() => {
		setShowLogoutModal(false);
	}, []);
	return {
		location,
		isFormPage,
		isAdminSection,
		showLogoutModal,
		openLogoutModal,
        closeLogoutModal,
	};
};

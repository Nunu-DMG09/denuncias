import React from "react";
import { DatosDenunciado } from "../pages/DatosDenunciado";
import { DatosDenunciante } from "../pages/DatosDenunciante";
import { InfoDenuncia } from "../pages/InfoDenuncia";
import { useFormContext } from "../hooks/useFormContext";
import { FormNavigator } from "./FormNavigator";

// import ResumenDenuncia from "../components/ResumenDenuncia";

const FormularioDenuncia: React.FC = () => {
	const { currentPage, error } = useFormContext();

	// Renderizar la página actual
	const renderPage = () => {
		switch (currentPage) {
			case 1:
				return <InfoDenuncia />;
			case 2:
				return <DatosDenunciado />;
			case 3:
				return <DatosDenunciante />;
			// case 4:
			// 	// return <ResumenDenuncia />;
			default:
				return <InfoDenuncia />;
		}
	};

	return (
		<div className="container mx-auto px-4 py-6 max-w-3xl">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Sistema de Denuncias - Municipalidad de Lambayeque
			</h2>

			{/* Barra de progreso - mantiene tu diseño existente */}
			<div className="mb-8">
				<div className="flex justify-between mb-2">
					{["Detalles", "Denunciado", "Denunciante", "Resumen"].map(
						(step, index) => (
							<div
								key={index}
								className={`text-sm text-center ${
									currentPage === index + 1
										? "font-bold text-(--primary-color)"
										: "text-gray-500"
								}`}
							>
								{step}
							</div>
						)
					)}
				</div>
				<div className="w-full bg-gray-200 h-2 rounded-full">
					<div
						className="bg-(--primary-color) h-2 rounded-full transition-all duration-300"
						style={{ width: `${(currentPage / 4) * 100}%` }}
					></div>
				</div>
			</div>

			{/* Mensaje de error global - mantiene tu diseño existente */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{/* Formulario */}
			<form className="rounded-lg p-6 shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]">
				{renderPage()}
				<FormNavigator />
			</form>
		</div>
	);
};

export default FormularioDenuncia;

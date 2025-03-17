import { useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import { InfoDenuncia } from "./Components/InfoDenuncia";
interface Step {
	id: number;
	title: string;
	isCompleted: boolean;
	isActive: boolean;
}

function App() {
	const [tipoDatos, setTipoDatos] = useState<string>("anonimo");
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [steps, setSteps] = useState<Step[]>([
		{
			id: 1,
			title: "Información de Denuncia",
			isCompleted: false,
			isActive: true,
		},
		{
			id: 2,
			title: "Datos del Denunciado",
			isCompleted: false,
			isActive: false,
		},
		{
			id: 3,
			title: "Datos del Denunciante",
			isCompleted: false,
			isActive: false,
		},
	]);
	const [selectedReason, setSelectedReason] = useState<number | null>(0);

	const handleNav = (direction: "next" | "back") => {
		if (direction === "next" && currentStep < 3) {
			setSteps((prev) =>
				prev.map((step) => {
					if (step.id === currentStep) {
						return { ...step, isCompleted: true, isActive: false };
					}
					if (step.id === currentStep + 1) {
						return { ...step, isActive: true };
					}
					return step;
				})
			);
			setCurrentStep((prev) => prev + 1);
		} else if (direction === "back" && currentStep > 1) {
			setSteps((prev) =>
				prev.map((step) => {
					if (step.id === currentStep) {
						return { ...step, isActive: false };
					}
					if (step.id === currentStep - 1) {
						return { ...step, isActive: true };
					}
					return step;
				})
			);
			setCurrentStep((prev) => prev - 1);
		}
	};
	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return <InfoDenuncia
					startDate={startDate}
					setStartDate={setStartDate}
					selectedReason={selectedReason}
					setSelectedReason={setSelectedReason}
				/>
			case 2:
				return (
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Nombre del Denunciado
							</label>
							<input
								type="text"
								className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Dirección del Denunciado
							</label>
							<input
								type="text"
								className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Teléfono del Denunciado
							</label>
							<input
								type="text"
								className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>
				);
			case 3:
				return (
					<div className="space-y-6">
						<div className="space-y-4">
							<h3 className="font-medium text-gray-900">
								Identificación del denunciante
							</h3>
							<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
								<input
									type="radio"
									name="datos"
									id={`datos-personales`}
									className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
									checked={tipoDatos === "datos-personales"}
									onChange={() =>
										setTipoDatos("datos-personales")
									}
								/>
								<label
									htmlFor={`datos-personales`}
									className="flex-1 cursor-pointer"
								>
									<span className="font-medium text-gray-700">
										Denuncia con datos personales
									</span>
									<p className="text-gray-500 text-sm mt-1">
										Si eliges esta opción, los responsables
										de procesar tu denuncia recibirán tus
										datos y podrás recibir actualizaciones,
										además, podrás solicitar medidas de
										protección.
									</p>
								</label>
							</div>
							<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
								<input
									type="radio"
									name="datos"
									id={`anónimo`}
									className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
									checked={tipoDatos === "anonimo"}
									onChange={() => setTipoDatos("anonimo")}
								/>
								<label
									htmlFor={`anónimo`}
									className="flex-1 cursor-pointer"
								>
									<span className="font-medium text-gray-700">
										Denuncia anónima
									</span>
									<p className="text-gray-500 text-sm mt-1">
										Eligiendo esta alternativa, nadie
										conocerá tu identifad, pero tampoco
										podrás añadir información a tu denuncia,
										recibir notificaciones sobre tu avance,
										ni pedir medidas de protección.
									</p>
								</label>
							</div>
						</div>
						{tipoDatos === "datos-personales" && (
							<div className="space-y-6">
								<div className="space-y-2 relative">
									<input
										type="text"
										className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
										placeholder=" "
									/>
									<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
										Nombre del Denunciante
									</label>
								</div>
								<div className="space-y-2 relative">
									<input
										type="text"
										className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
										placeholder=" "
									/>
									<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
										Dirección del Denunciante
									</label>
								</div>
								<div className="space-y-2 relative">
									<input
										type="text"
										className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
										placeholder=" "
									/>
									<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
										Teléfono del Denunciante
									</label>
								</div>
							</div>
						)}
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen">
			<Header />
			<main className="container mx-auto px-4 pt-28 pb-8">
				<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
					Realizar Denuncias sobre Fraude
				</h1>

				<section className="max-w-4xl mx-auto rounded-lg shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]">
					<div className="bg-gray-50 p-6 border-b">
						<div className="flex justify-center items-center gap-0 md:gap-4 max-w-md mx-auto">
							{steps.map((step, index) => (
								<div
									key={step.id}
									className="flex items-center"
								>
									<div
										key={step.id}
										className={`flex items-center justify-center w-12 h-12 rounded-full ${
											step.isActive
												? "bg-(--primary-color) text-white"
												: "bg-slate-500 text-white"
										}`}
									>
										{step.id}
									</div>
									{index < steps.length - 1 && (
										<div
											className={`h-1 w-16 mx-2 ${
												step.isActive
													? "bg-(--primary-color)"
													: "bg-slate-400"
											}`}
										/>
									)}
								</div>
							))}
						</div>
					</div>
					<div className="p-6">
						<form className="space-y-6">{renderStepContent()}</form>
					</div>

					{/* Action Buttons */}
					<div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
						{currentStep > 1 && (
							<button
								onClick={() => handleNav("back")}
								className="px-5 md:px-10 py-4 border border-(--gray-light) rounded-md text-(--gray) cursor-pointer hover:scale-105 hover:bg-gray-300 transition-all ease-out duration-300"
							>
								Atrás
							</button>
						)}
						<button
							onClick={() => handleNav("next")}
							className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
						>
							{currentStep === 3
								? "Enviar Denuncia"
								: "Siguiente"}
							{currentStep === 3 ? (
								<i className="fa-solid fa-check ml-2"></i>
							) : (
								<i className="fa-solid fa-arrow-right ml-2"></i>
							)}
						</button>
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;

import { useState } from "react";
import "./App.css";
import Header from "./Components/Header";

interface Step {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

function App() {
	const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: "Información de Denuncia", isCompleted: false, isActive: true },
    { id: 2, title: "Datos del Denunciado", isCompleted: false, isActive: false },
    { id: 3, title: "Datos del Denunciante", isCompleted: false, isActive: false },
  ]);
  const [selectedReason, setSelectedReason] = useState<number | null>(0);
	return (
		<div className="min-h-screen">
			<Header />
			<main className="container mx-auto px-4 pt-28 pb-8">
				<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
					Realizar Denuncias sobre Fraude
				</h1>

				<section className="max-w-4xl mx-auto rounded-lg shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]">
					<div className="bg-gray-50 p-6 border-b">
						<div className="flex justify-center items-center gap-4 max-w-md mx-auto">
							{[1, 2, 3].map((step) => (
								<div key={step} className="flex items-center">
									<button
										type="button"
										className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
									>
										{step}
									</button>
									{step < 3 && (
										<div className="h-1 w-16 bg-blue-200 mx-2" />
									)}
								</div>
							))}
						</div>
					</div>
					<div className="p-6">
						<form className="space-y-6">
							{/* Date Input */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700">
									Fecha de denuncia
								</label>
								<input
									type="date"
									className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							{/* Radio Options */}
							<div className="space-y-4">
								<h3 className="font-medium text-gray-900">
									Identifique el motivo de la denuncia
								</h3>
								{[1, 2, 3, 4, 5].map((num) => (
									<div
										key={num}
										className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300"
									>
										<input
											type="radio"
											name="reason"
											id={`reason-${num}`}
											className="mt-1"
											onChange={() =>
												setSelectedReason(num)
											}
											checked={selectedReason === num}
										/>
										<label
											htmlFor={`reason-${num}`}
											className="flex-1 cursor-pointer"
										>
											<span className="font-medium text-gray-700">
												Opción {num}
											</span>
											<p className="text-gray-500 text-sm mt-1">
												Lorem ipsum dolor sit amet,
												consectetur adipisicing elit.
											</p>
										</label>
									</div>
								))}
							</div>
							{/* Después del map de radio buttons */}
							{selectedReason === 5 && (
								<div className="mt-4 p-4 border rounded-lg bg-gray-50">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Especifique otro motivo
									</label>
									<input
										type="text"
										className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Describa el motivo de su denuncia"
									/>
								</div>
							)}
							{/* Additional Details */}
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Cuéntanos qué sucedió
									</label>
									<textarea
										rows={4}
										className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Escribe aquí tu denuncia"
									/>
								</div>

								<div>
									<label
										className="flex items-center px-4 py-2 border rounded-md text-blue-600 hover:bg-blue-50 w-1/3 cursor-pointer mx-auto"
										htmlFor="file"
									>
										<i className="fas fa-paperclip mr-2"></i>
										Adjuntar Pruebas
									</label>
									<input
										type="file"
										className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										id="file"
										hidden
									/>
								</div>
							</div>
						</form>
					</div>

					{/* Action Buttons */}
					<div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
						<button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
							Atrás
						</button>
						<button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
							Siguiente
						</button>
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;

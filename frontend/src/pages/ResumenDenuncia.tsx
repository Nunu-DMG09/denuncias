import { useState } from "react";
import { useFormContext } from "../hooks/useFormContext";
import * as Icons from '../Components/Icons';

export const ResumenDenuncia = () => {
	const { formData } = useFormContext();
	const [copied, setCopied] = useState(false);

	// Supongamos que el código de seguimiento viene del contexto
	const trackingCode = formData.tracking_code || "#123456";
	console.log(formData);
	console.log(trackingCode);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(trackingCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div id="confirmation-page" className="space-y-8 max-w-3xl mx-auto">
			{/* Encabezado con icono de éxito */}
			<div className="space-y-4 text-center">
				<div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
					<Icons.CompletedIcon />
				</div>
				<h2 className="text-2xl md:text-3xl font-bold text-gray-800">
					¡Gracias por ingresar tu denuncia!
				</h2>
				<p className="text-gray-600">
					Hemos recibido tu información y será procesada a la
					brevedad.
				</p>
			</div>

			{/* Sección de código de seguimiento */}
			<div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
				<p className="text-gray-700 font-medium text-center">
					Código de seguimiento de denuncia
				</p>
				<div className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-sm border border-gray-200">
					<div className="bg-blue-50 flex-grow p-4 flex items-center justify-center">
						<p className="text-2xl font-mono font-semibold text-blue-700">
							{trackingCode}
						</p>
					</div>
					<button
						onClick={copyToClipboard}
						className={`p-4 ${
							copied ? "bg-green-600" : "bg-blue-600"
						} text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center`}
					>
						{copied ? (
							<>
								<Icons.CheckIcon />
								Copiado!
							</>
						) : (
							<>
								<Icons.CopyIcon />
								Copiar código
							</>
						)}
					</button>
				</div>
				<p className="text-sm text-gray-500 text-center">
					Guarde este código para consultar el estado de su denuncia
					posteriormente.
				</p>
			</div>
			<div className="bg-blue-50 border-l-4 border-(--primary-color) p-5 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0"></div>
					<div className="ml-3">
						<p className="text-sm text-gray-700">
							Revisaremos tu denuncia al detalle y, de ser el
							caso, las pruebas que nos hiciste llegar. Si
							compartiste tu correo y/o número de celular,
							recibirás notificaciones sobre el avance de tu caso.
							De lo contrario, puedes{" "}
							<span className="font-medium text-(--primary-color)">
								conocer su estado
							</span>{" "}
							con tu código de seguimiento.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

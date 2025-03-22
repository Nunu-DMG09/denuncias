import { useFormContext } from "../../hooks/useFormContext";
import * as Icons from '../../Components/Icons';
import { useDenuncias } from "../../hooks/useDenuncias";

export const ResumenDenuncia = () => {
	const { formData } = useFormContext();
	const trackingCode = formData.tracking_code || "Código no disponible";
	const { copyToClipboard, copied } = useDenuncias();
	
	return (
		<div id="confirmation-page" className="space-y-8 max-w-3xl mx-auto">
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
			<div className="space-y-4 p-6">
				<p className="text-gray-700 font-medium text-center">
					Código de seguimiento de denuncia
				</p>
				<div className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-sm border border-gray-200">
					<div className="bg-blue-50 flex-grow p-4 flex items-center justify-center">
						<p className="text-[1.2rem] md:text-2xl font-mono font-semibold text-(--primary-color)">
							{trackingCode}
						</p>
					</div>
					<button
						onClick={() => copyToClipboard(trackingCode)}
						className={`p-4 cursor-pointer ${
							copied ? "bg-green-600 hover:bg-green-400" : "bg-(--secondary-color) hover:bg-(--primary-color)"
						} text-white transition-colors duration-300 focus:outline-none flex items-center justify-center`}
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
					<div className="flex-shrink-0">
						<Icons.InfoIcon />
					</div>
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

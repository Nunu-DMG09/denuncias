import { useState } from "react";
import { useFormContext } from "../hooks/useFormContext";

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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    ¡Gracias por ingresar tu denuncia!
                </h2>
                <p className="text-gray-600">
                    Hemos recibido tu información y será procesada a la brevedad.
                </p>
            </div>

            {/* Sección de código de seguimiento */}
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <p className="text-gray-700 font-medium text-center">
                    Código de seguimiento de denuncia
                </p>
                <div className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-sm border border-gray-200">
                    <div className="bg-blue-50 flex-grow p-4 flex items-center justify-center">
                        <p className="text-2xl font-mono font-semibold text-blue-700">{trackingCode}</p>
                    </div>
                    <button 
                        onClick={copyToClipboard}
                        className={`p-4 ${copied ? 'bg-green-600' : 'bg-blue-600'} text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center`}
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copiado!
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copiar código
                            </>
                        )}
                    </button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                    Guarde este código para consultar el estado de su denuncia posteriormente.
                </p>
            </div>

            {/* Sección informativa */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <span className="font-medium">Información importante:</span> Revisaremos tu denuncia al detalle y, de ser el caso, las pruebas que nos hiciste llegar. Si compartiste tu correo y/o número de celular, recibirás notificaciones sobre el avance de tu caso. De lo contrario, puedes conocer su estado con tu código de seguimiento.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Botón de descargar comprobante */}
            <div className="pt-4">
                <button 
                    id="pdf-button"
                    type="button" 
                    className="w-full md:w-auto px-6 py-3 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar comprobante
                </button>
            </div>
        </div>
    );
};

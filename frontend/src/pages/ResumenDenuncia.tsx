export const ResumenDenuncia = () => {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
					Gracias por ingresar tu denuncia
				</h2>
			</div>
            <div className="space-y-4">

				<p className="text-gray-600 text-center">
					Código de seguimiento de denuncia
				</p>
                <div className="flex justify-center items-center bg-amber-100 w-1/2 mx-auto rounded-lg">
                    <p className="text-2xl font-semibold text-center bg-white p-3 w-1/2">
                        #123456
                    </p>
                    <button className="p-4 bg-primary-color text-white bg-green-500 w-1/2 h-full">
                        Copiar código
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                <p className="text-gray-600 bg-amber-500 text-justify leading-relaxed p-3 w- mx-auto">
                    Revisaremos tu denuncia al detalle y, de ser el caso, las pruebas que nos hiciste llegar. Si compartiste tu correo y/o número de celular, recibirás notificaciones sobre el avance de tu caso. De lo contrario, puedes conocer su estado con tu código de seguimiento.
                </p>
            </div>
		</div>
	);
};

export const SearchAdmin = () => {
    return (
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Buscar Administrador</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => {
                                // Aquí puedes agregar la lógica para buscar un administrador
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
                {/* Aquí puedes agregar el formulario de búsqueda */}
            </div>
        </div>
    )
}
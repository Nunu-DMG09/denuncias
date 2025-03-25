export const MotivosLoader = () => {
    return (
        <div className="space-y-4">
            <h3 className="font-medium text-gray-900 animate-pulse">
                Identifique el motivo de la denuncia
            </h3>
            {/* Simulamos 5 elementos de motivos */}
            {Array(5).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="flex items-start space-x-3 p-4 bg-gray-300 rounded-lg animate-pulse"
                >
                    <div className="mt-1 w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
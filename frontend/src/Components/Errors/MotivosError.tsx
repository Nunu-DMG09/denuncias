import { ErrorWarningIcon } from "../Icons";

export const MotivosError = ({error} : {error:string}) => {
	return (
		<div className="flex flex-col items-center justify-center h-64 text-center">
			<div className="text-red-600 mb-4">
                <ErrorWarningIcon />
				<h3 className="text-lg font-medium mt-2">Error de carga</h3>
			</div>
			<p className="text-gray-600 mb-4">{error}</p>
			<button
				onClick={() => window.location.reload()}
				className="px-4 py-2 bg-(--primary-color) text-white rounded hover:bg-(--secondary-color) transition-all cursor-pointer duration-300 ease"
			>
				Reintentar
			</button>
		</div>
	);
};

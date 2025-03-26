import { LoaderWifi } from "../Loaders/LoaderWiFi";
import { ErrorIcon } from "../Icons";
import { TimeLine } from "./TimeLine";
import { TrackingData } from "../../types";

interface TrackProps {
	trackingUtils: {
		trackingCode: string;
		trackingData: TrackingData | null;
		trackingLoading: boolean;
		trackingError: string | null;
		displayTrackingCode: string;
		getStatusIcon: (status: string) => string;
		formatDate: (date: string) => string;
		getGlowColorFromStatus: (status: string) => string;
	};
}

export const Track = ({ trackingUtils }: TrackProps) => {
	const {
		trackingData,
		trackingLoading,
		trackingError,
		displayTrackingCode,
	} = trackingUtils;
	return (
		<div className="space-y-6 mt-5">
			{trackingLoading && (
				<div className="flex flex-col items-center justify-center py-6">
					<div className="flex flex-col items-center justify-center py-6">
						<LoaderWifi />
					</div>
				</div>
			)}
			{trackingError && !trackingLoading && (
				<div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
					<div className="flex">
						<div className="flex-shrink-0">
							<ErrorIcon />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium">
								No se encontró la denuncia
							</p>
							<p className="text-sm mt-1">{trackingError}</p>
						</div>
					</div>
				</div>
			)}
			{!trackingLoading &&
				!trackingError &&
				trackingData &&
				trackingData.data && (
					<div className="mt-2 relative">
						{trackingData.data.length > 0 && (
							<div className="bg-white rounded-lg p-5 shadow-md mb-8 border-l-4 border-(--primary-color)">
								<h3 className="text-lg font-bold text-gray-800 mb-2">
									Información de la denuncia
								</h3>
								<div className="flex items-center">
									<span className="text-sm font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
										{displayTrackingCode}
									</span>
								</div>
							</div>
						)}
						<TimeLine trackingUtils={trackingUtils} />
						{trackingData.data.length === 0 && (
							<div className="bg-amber-50 rounded-lg p-4 text-amber-800 flex items-center">
								<i className="fa-solid fa-exclamation-triangle mr-3"></i>
								<p>
									No hay información de seguimiento disponible
									para esta denuncia.
								</p>
							</div>
						)}
					</div>
				)}
		</div>
	);
};

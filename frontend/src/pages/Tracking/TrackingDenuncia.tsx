import { useTracking } from "../../hooks/useTracking";
import { Track } from "../../Components/Tracking/Track";
export const TrackingDenuncia = () => {
	const trackingUtils = useTracking();
	const { trackingCode, handleInputChange, handleSubmit, trackingLoading } =
		trackingUtils;
	return (
		<div className="container mx-auto px-4 py-6 max-w-3xl">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
				Seguimiento de Denuncia
			</h2>
			<form
				className="rounded-lg p-6 shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d]"
				onSubmit={handleSubmit}
			>
				<div className="space-y-2 relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={trackingCode}
						onChange={handleInputChange}
						minLength={20}
						maxLength={20}
						disabled={trackingLoading}
						required
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Código de Seguimiento
						<span className="text-red-500 font-black">*</span>
					</label>
					<button className="absolute right-2 top-[44%] transform -translate-y-1/2 bg-(--secondary-color) text-white font-semibold px-4 py-2 rounded-lg cursor-pointer hover:scale-110 hover:bg-(--primary-color) transition-all ease-in-out duration-300">
						<i className="fa-solid fa-magnifying-glass"></i>
					</button>
				</div>
				<Track trackingUtils={trackingUtils} />
			</form>
		</div>
	);
};

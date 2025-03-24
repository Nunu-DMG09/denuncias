interface LoaderProps {
	isBtn: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isBtn }) => {
	return (
		<div
			className={
				isBtn
					? "mx-auto my-0"
					: "absolute right-4 top-1/2 transform -translate-y-1/2"
			}
		>
			<div
				className={`w-6 h-6 border-2 border-transparent text-(--secondary-color) animate-spin flex items-center justify-center ${isBtn ? 'border-t-(--tertiary-color)' : 'border-t-(--secondary-color)' } rounded-full`}
			>
				<div
					className={`w-4 h-4 border-2 border-transparent text-(--primary-color) animate-spin flex items-center justify-center border-t-(--primary-color) rounded-full`}
				></div>
			</div>
		</div>
	);
};

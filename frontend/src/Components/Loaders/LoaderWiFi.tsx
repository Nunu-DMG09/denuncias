import './LoaderWifi.css';
export const LoaderWifi = () => {
	return (
		<div className='wifi-loader w-16 h-16 rounded-[50px] relative flex items-center justify-center'>
			<svg className="circle-outer h-[86px] w-[86px] absolute flex items-center justify-center" viewBox="0 0 86 86">
				<circle className="back absolute fill-none transform -rotate-[100deg]" cx="43" cy="43" r="40"></circle>
				<circle className="front absolute fill-none transform -rotate-[100deg] stroke-(--primary-color)" cx="43" cy="43" r="40"></circle>
				<circle className="new absolute fill-none transform -rotate-[100deg]" cx="43" cy="43" r="40"></circle>
			</svg>
			<svg className="circle-middle h-[60px] w-[60px] absolute flex items-center justify-center" viewBox="0 0 60 60">
				<circle className="back absolute fill-none transform -rotate-[100deg]" cx="30" cy="30" r="27"></circle>
				<circle className="front absolute fill-none transform -rotate-[100deg] stroke-(--primary-color)" cx="30" cy="30" r="27"></circle>
			</svg>
			<svg className="circle-inner h-[34px] w-[34px] absolute flex items-center justify-center" viewBox="0 0 34 34">
				<circle className="back absolute fill-none transform -rotate-[100deg]" cx="17" cy="17" r="14"></circle>
				<circle className="front absolute fill-none transform -rotate-[100deg] stroke-(--primary-color)" cx="17" cy="17" r="14"></circle>
			</svg>
			<div className="text absolute flex items-center justify-center -bottom-10 font-medium text-sm" data-text="Buscando..."></div>
		</div>
	);
};

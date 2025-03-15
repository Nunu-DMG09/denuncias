import "../header.css"; 
const logo = "/logo.jpeg"; 

const Header = () => {
  return (
    <header className="header shadow-md w-full bg-white py-4 px-4">
				<nav className="nav-container">
					<div className="nav-content flex items-center gap-4">
						<a
							className="logo-section flex items-center gap-4"
							href="https://www.munijlo.gob.pe/web/"
							target="_blank"
							rel="noreferrer"
						>
							<img
								alt="Logo Municipal"
								className="nav-logo w-12 h-16 object-contain"
								src={logo}
							/>
							<h3 className="font-semibold flex flex-col text-lg text-gray-700">
								<span>Municipalidad Distrital de</span>
								<span>José Leonardo Ortiz</span>
							</h3>
						</a>
					</div>
				</nav>
			</header>
  );
};

export default Header;

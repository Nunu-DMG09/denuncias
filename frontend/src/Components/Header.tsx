import React from "react";
import "../header.css"; 

const logo = "/logo.jpeg"; 

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__content">
        {/* Envolver el logo y el texto en un <a> */}
        <a href="https://www.munijlo.gob.pe/web/" target="_blank" rel="noopener noreferrer" className="header__logo">
          <img src={logo} alt="Logo Municipalidad" />
          <h3 className="header__text">
            <span>Municipalidad Distrital de</span>
            <span>José Leonardo Ortiz</span>
          </h3>
        </a>
        <button className="header__button">Ver estado de denuncia</button>
      </div>
    </header>
  );
};

export default Header;

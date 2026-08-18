import { Link, useLocation } from "react-router-dom";
import "./estilo/Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          ⚽ FootballHub
        </Link>
        <nav className="header-nav">
          <Link
            to="/"
            className={`header-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Inicio
          </Link>
          <Link
            to="/favoritos"
            className={`header-link ${location.pathname === "/favoritos" ? "active" : ""}`}
          >
            Favoritos
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
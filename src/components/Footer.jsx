import "./estilo/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4 className="footer-title">⚽ FootballHub</h4>
            <p className="footer-text">
              Tu plataforma de seguimiento de fútbol en tiempo real.
              Resultados en vivo, buscador y favoritos.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Información</h4>
            <ul className="footer-list">
              <li>Datos provistos por API-Sports</li>
              <li>Actualización automática cada 60 segundos</li>
              <li>Favoritos guardados en localStorage</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Creadores</h4>
            <p className="footer-text">
              Proyecto desarrollado con React, Vite y Axios.
              Diseñado para amantes del fútbol.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FootballHub. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
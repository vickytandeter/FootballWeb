import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";
import "../estilo/MatchCard.css";

const MatchCard = ({ fixture, isFav, onToggleFavorite, showRemoveButton }) => {
  const { home, away } = fixture;
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Fecha a confirmar";
    return d.toLocaleString("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="match-card"
      onClick={() => navigate(`/match/${fixture.leagueCode}/${fixture.id}`)}
    >
      <div className="match-card__league-bar">
        <div className="match-card__league-info">
          <span className="match-card__league-name">{fixture.league}</span>
        </div>
        <StatusBadge status={fixture.status} />
      </div>

      <div className="match-card__body">
        <div className="match-card__team match-card__team--home">
          {home.logo ? (
            <img
              src={home.logo}
              alt={home.name}
              className="match-card__team-logo"
            />
          ) : (
            <div className="match-card__team-logo-placeholder">
              {home.name?.charAt(0)}
            </div>
          )}
          <span className="match-card__team-name">{home.name}</span>
        </div>

        {fixture.status?.state === "pre" ? (
          <div className="match-card__score match-card__score--pending">
            <span className="match-card__vs">vs</span>
          </div>
        ) : (
          <div className="match-card__score">
            <span className="match-card__goals">{home.score ?? 0}</span>
            <span className="match-card__divider">-</span>
            <span className="match-card__goals">{away.score ?? 0}</span>
          </div>
        )}

        <div className="match-card__team match-card__team--away">
          <span className="match-card__team-name">{away.name}</span>
          {away.logo ? (
            <img
              src={away.logo}
              alt={away.name}
              className="match-card__team-logo"
            />
          ) : (
            <div className="match-card__team-logo-placeholder">
              {away.name?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="match-card__footer">
        <span className="match-card__date">{formatDate(fixture.date)}</span>
        {onToggleFavorite && (
          <button
            className={`match-card__fav-btn ${isFav ? "match-card__fav-btn--active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(fixture);
            }}
            title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isFav ? "❤️" : "🤍"}{" "}
            {showRemoveButton ? "Quitar de favoritos" : "Agregar a favoritos"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
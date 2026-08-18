import StatusBadge from "./StatusBadge";
import "../estilo/MatchCard.css";

const MatchCard = ({ fixture, isFav, onToggleFavorite, showRemoveButton }) => {
  const { home, away } = fixture.teams;
  const { home: homeGoals, away: awayGoals } = fixture.goals;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="match-card">
      <div className="match-card__league-bar">
        <div className="match-card__league-info">
          {fixture.league.logo && (
            <img
              src={fixture.league.logo}
              alt={fixture.league.name}
              className="match-card__league-logo"
            />
          )}
          <span className="match-card__league-name">{fixture.league.name}</span>
        </div>
        <StatusBadge status={fixture.fixture.status} />
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
              {home.name.charAt(0)}
            </div>
          )}
          <span className="match-card__team-name">{home.name}</span>
        </div>

        <div className="match-card__score">
          <span className="match-card__goals">{homeGoals ?? 0}</span>
          <span className="match-card__divider">-</span>
          <span className="match-card__goals">{awayGoals ?? 0}</span>
        </div>

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
              {away.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="match-card__footer">
        <span className="match-card__date">{formatDate(fixture.fixture.date)}</span>
        {onToggleFavorite && (
          <button
            className={`match-card__fav-btn ${isFav ? "match-card__fav-btn--active" : ""}`}
            onClick={() => onToggleFavorite(fixture)}
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
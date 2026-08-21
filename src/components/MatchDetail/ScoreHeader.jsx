import { useState } from "react";
import {
  addFavoriteTeam,
  removeFavoriteTeam,
  isFavoriteTeam,
} from "../../services/storage";

export default function ScoreHeader({ match }) {
  const parsedDate = new Date(match.date);

  const dateStr = isNaN(parsedDate.getTime())
    ? "Fecha a confirmar"
    : parsedDate.toLocaleString("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const isLive = match.status.state === "in";

  const [homeFavorite, setHomeFavorite] = useState(
    isFavoriteTeam(match.home.id)
  );

  const [awayFavorite, setAwayFavorite] = useState(
    isFavoriteTeam(match.away.id)
  );

  const toggleFavoriteTeam = (team, isFavorite, setIsFavorite) => {
    if (isFavorite) {
      removeFavoriteTeam(team.id);
      setIsFavorite(false);
    } else {
      addFavoriteTeam({
        id: team.id,
        name: team.name,
        logo: team.logo,
        league: match.league,
        leagueCode: match.leagueCode,
      });

      setIsFavorite(true);
    }
  };

  return (
    <div className="md-header">

      <div className="md-headerLeague">
        <span>{match.league}</span>
      </div>

      <div className="md-scoreboard">

        {/* LOCAL */}
        <div className="md-scoreTeam">

          {match.home.logo && (
            <img
              src={match.home.logo}
              alt={match.home.name}
              className="md-scoreLogo"
            />
          )}

          <span className="md-scoreTeamName">
            {match.home.name}
          </span>

          <button
            type="button"
            className={`md-teamFavoriteBtn ${
              homeFavorite ? "md-teamFavoriteBtn--active" : ""
            }`}
            onClick={() =>
              toggleFavoriteTeam(
                match.home,
                homeFavorite,
                setHomeFavorite
              )
            }
            title={
              homeFavorite
                ? "Quitar de favoritos"
                : "Agregar a favoritos"
            }
          >
            {homeFavorite ? "♥" : "♡"}
          </button>

        </div>

        {/* MARCADOR */}
        <div className="md-scoreCenter">

          <div className="md-scoreNumbers">
            <span className="md-scoreBig">
              {match.home.score ?? 0}
            </span>

            <span className="md-scoreDash">
              -
            </span>

            <span className="md-scoreBig">
              {match.away.score ?? 0}
            </span>
          </div>

          <span
            className={`md-statusBadge ${
              isLive ? "md-statusLive" : ""
            }`}
          >
            {isLive && (
              <span className="md-statusDot" />
            )}

            {isLive
              ? `${match.status.clock || ""} En Vivo`
              : match.status.state === "post"
                ? "Finalizado"
                : "Programado"}
          </span>

        </div>

        {/* VISITANTE */}
        <div className="md-scoreTeam">

          {match.away.logo && (
            <img
              src={match.away.logo}
              alt={match.away.name}
              className="md-scoreLogo"
            />
          )}

          <span className="md-scoreTeamName">
            {match.away.name}
          </span>

          <button
            type="button"
            className={`md-teamFavoriteBtn ${
              awayFavorite ? "md-teamFavoriteBtn--active" : ""
            }`}
            onClick={() =>
              toggleFavoriteTeam(
                match.away,
                awayFavorite,
                setAwayFavorite
              )
            }
            title={
              awayFavorite
                ? "Quitar de favoritos"
                : "Agregar a favoritos"
            }
          >
            {awayFavorite ? "♥" : "♡"}
          </button>

        </div>

      </div>

      <div className="md-headerMeta">
        <span>{dateStr}</span>

        {match.venue && (
          <span>{match.venue}</span>
        )}
      </div>

    </div>
  );
}
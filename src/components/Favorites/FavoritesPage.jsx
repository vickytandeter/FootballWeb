import { useState } from "react";
import {
  getFavoriteTeams,
  removeFavoriteTeam,
} from "../../services/storage";
import "../estilo/FavoritesPage.css";

const FavoritesPage = () => {
  const [favoriteTeams, setFavoriteTeams] = useState(
    getFavoriteTeams()
  );

  const handleRemoveTeam = (teamId) => {
    const updated = removeFavoriteTeam(teamId);
    setFavoriteTeams([...updated]);
  };

  return (
    <div className="favorites-page">

      <section className="favorites-header">
        <h1 className="favorites-header__title">
          ❤️ Mis Equipos
        </h1>

        <p className="favorites-header__subtitle">
          {favoriteTeams.length === 0
            ? "Aún no agregaste equipos a favoritos."
            : `Tenés ${favoriteTeams.length} ${
                favoriteTeams.length === 1
                  ? "equipo guardado"
                  : "equipos guardados"
              }.`}
        </p>
      </section>

      {favoriteTeams.length === 0 ? (
        <div className="favorites-empty">
          <p>
            Aún no agregaste equipos a favoritos.
          </p>

          <p>
            Entrá al detalle de un partido y tocá
            el corazón junto al equipo que quieras guardar.
          </p>
        </div>
      ) : (
        <div className="favoriteTeams-grid">

          {favoriteTeams.map((team) => (
            <article
              key={team.id}
              className="favoriteTeam-card"
            >

              <div className="favoriteTeam-logoWrapper">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="favoriteTeam-logo"
                  />
                ) : (
                  <div className="favoriteTeam-noLogo">
                    ⚽
                  </div>
                )}
              </div>

              <div className="favoriteTeam-info">
                <h2 className="favoriteTeam-name">
                  {team.name}
                </h2>

                <span className="favoriteTeam-league">
                  {team.league}
                </span>
              </div>

              <button
                type="button"
                className="favoriteTeam-remove"
                onClick={() =>
                  handleRemoveTeam(team.id)
                }
                title="Quitar de favoritos"
              >
                ×
              </button>

            </article>
          ))}

        </div>
      )}

    </div>
  );
};

export default FavoritesPage;
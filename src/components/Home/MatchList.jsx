import MatchCard from "./MatchCard";
import "../estilo/MatchList.css";

const MatchList = ({
  fixtures,
  favorites,
  onToggleFavorite,
  showRemoveButton = false,
  loading,
  error,
  emptyMessage,
}) => {
  if (loading) {
    return (
      <div className="match-list__state">
        <div className="match-list__loader" />
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-list__state">
        <span className="match-list__error-icon">⚠️</span>
        <p>No fue posible obtener la información.</p>
      </div>
    );
  }

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="match-list__state">
        <span className="match-list__empty-icon">📡</span>
        <p>{emptyMessage || "No encontramos resultados."}</p>
      </div>
    );
  }

  return (
    <div className="match-list">
      {fixtures.map((fixture) => {
        const fixtureId = fixture.fixture.id;
        const isFav = favorites.some((f) => f.fixtureId === fixtureId);

        return (
          <MatchCard
            key={fixtureId}
            fixture={fixture}
            isFav={isFav}
            onToggleFavorite={onToggleFavorite}
            showRemoveButton={showRemoveButton}
          />
        );
      })}
    </div>
  );
};

export default MatchList;
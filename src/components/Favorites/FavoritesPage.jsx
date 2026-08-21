import { useState } from "react";
import { getFavorites, removeFavorite } from "../../services/storage";
import MatchList from "../Home/MatchList";
import "../estilo/FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState(getFavorites);

  const handleRemoveFavorite = (fixture) => {
    const updated = removeFavorite(fixture.id);
    setFavorites([...updated]);
  };

  return (
    <div className="favorites-page">
      <section className="favorites-header">
        <h1 className="favorites-header__title">❤️ Mis Favoritos</h1>
        <p className="favorites-header__subtitle">
          {favorites.length === 0
            ? "Aún no agregaste partidos a favoritos."
            : `Tenés ${favorites.length} ${favorites.length === 1 ? "partido guardado" : "partidos guardados"}.`}
        </p>
      </section>

      <MatchList
        fixtures={favorites}
        favorites={favorites}
        onToggleFavorite={handleRemoveFavorite}
        showRemoveButton={true}
        emptyMessage="Aún no agregaste partidos a favoritos. Volvé al inicio y hacé clic en 'Agregar a favoritos'."
      />
    </div>
  );
};

export default FavoritesPage;
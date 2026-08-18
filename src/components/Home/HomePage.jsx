import { useState, useEffect, useCallback } from "react";
import { getLiveFixtures } from "../../services/api";
import { getFavorites, addFavorite, removeFavorite } from "../../services/storage";
import SearchBar from "./SearchBar";
import MatchList from "./MatchList";
import "../estilo/HomePage.css";

const HomePage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(getFavorites);

  const fetchFixtures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLiveFixtures();
      setFixtures(data);
    } catch (err) {
      console.error("Error al obtener los partidos:", err);
      setError("No fue posible obtener la información.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFixtures();
    const interval = setInterval(fetchFixtures, 60000);
    return () => clearInterval(interval);
  }, [fetchFixtures]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleToggleFavorite = (fixture) => {
    const { id } = fixture.fixture;
    const isFav = favorites.some((f) => f.fixtureId === id);

    if (isFav) {
      const updated = removeFavorite(id);
      setFavorites([...updated]);
    } else {
      const updated = addFavorite(fixture);
      setFavorites([...updated]);
    }
  };

  const filteredFixtures = fixtures.filter((fixture) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const { home, away } = fixture.teams;
    const { name, country } = fixture.league;
    return (
      home.name.toLowerCase().includes(query) ||
      away.name.toLowerCase().includes(query) ||
      name.toLowerCase().includes(query) ||
      (country && country.toLowerCase().includes(query))
    );
  });

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero__title">
          Fútbol en <span className="home-hero__accent">Vivo</span>
        </h1>
        <p className="home-hero__subtitle">
          Seguí todos los partidos que se están jugando ahora mismo.
          Buscá por equipo o liga y guardá tus favoritos.
        </p>
      </section>

      <SearchBar onSearch={handleSearch} />

      <section className="home-matches">
        <h2 className="home-matches__title">
          📡 Partidos en Vivo
          {searchQuery && (
            <span className="home-matches__filter-label">
              {" "}- Filtrando: &quot;{searchQuery}&quot;
            </span>
          )}
        </h2>
        <MatchList
          fixtures={filteredFixtures}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          loading={loading}
          error={error}
          emptyMessage={
            searchQuery
              ? "No encontramos resultados para esa búsqueda."
              : "No hay partidos en vivo en este momento."
          }
        />
      </section>
    </div>
  );
};

export default HomePage;
const STORAGE_KEY = "football_hub_favorites";

export const getFavorites = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const addFavorite = (fixture) => {
  const favorites = getFavorites();
  const exists = favorites.some((f) => f.fixtureId === fixture.fixture.id);
  if (exists) return;
  const { id, date, status, referee } = fixture.fixture;
  const { name, logo, country } = fixture.league;
  const newFav = {
    fixtureId: id,
    date,
    status,
    referee,
    league: { name, logo, country },
    homeTeam: { ...fixture.teams.home },
    awayTeam: { ...fixture.teams.away },
    goals: { ...fixture.goals },
  };
  const newFavorites = [...favorites, newFav];
  saveFavorites(newFavorites);
  return newFavorites;
};

export const removeFavorite = (fixtureId) => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter((f) => f.fixtureId !== fixtureId);
  saveFavorites(newFavorites);
  return newFavorites;
};

export const isFavorite = (fixtureId) => {
  return getFavorites().some((f) => f.fixtureId === fixtureId);
};
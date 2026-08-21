const STORAGE_KEY = "football_hub_favorites_espn";

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

export const addFavorite = (match) => {
  const favorites = getFavorites();
  const exists = favorites.some((f) => f.id === match.id);
  if (exists) return favorites;
  const newFavorites = [...favorites, { ...match, savedAt: Date.now() }];
  saveFavorites(newFavorites);
  return newFavorites;
};

export const removeFavorite = (matchId) => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter((f) => f.id !== matchId);
  saveFavorites(newFavorites);
  return newFavorites;
};

export const isFavorite = (matchId) => {
  return getFavorites().some((f) => f.id === matchId);
};
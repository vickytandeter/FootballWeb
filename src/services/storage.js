const STORAGE_KEY = "football_hub_favorites_espn";
const TEAM_STORAGE_KEY = "football_hub_favorite_teams_espn";

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

  const newFavorites = [
    ...favorites,
    {
      ...match,
      savedAt: Date.now(),
    },
  ];

  saveFavorites(newFavorites);

  return newFavorites;
};

export const removeFavorite = (matchId) => {
  const favorites = getFavorites();

  const newFavorites = favorites.filter(
    (f) => f.id !== matchId
  );

  saveFavorites(newFavorites);

  return newFavorites;
};

export const isFavorite = (matchId) => {
  return getFavorites().some(
    (f) => f.id === matchId
  );
};

export const getFavoriteTeams = () => {
  try {
    const data = localStorage.getItem(TEAM_STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFavoriteTeams = (teams) => {
  localStorage.setItem(
    TEAM_STORAGE_KEY,
    JSON.stringify(teams)
  );
};

export const addFavoriteTeam = (team) => {
  const teams = getFavoriteTeams();

  const exists = teams.some(
    (t) => String(t.id) === String(team.id)
  );

  if (exists) return teams;

  const newTeams = [
    ...teams,
    {
      id: team.id,
      name: team.name,
      logo: team.logo || null,
      league: team.league || "",
      leagueCode: team.leagueCode || "",
      savedAt: Date.now(),
    },
  ];

  saveFavoriteTeams(newTeams);

  return newTeams;
};

export const removeFavoriteTeam = (teamId) => {
  const teams = getFavoriteTeams();

  const newTeams = teams.filter(
    (team) => String(team.id) !== String(teamId)
  );

  saveFavoriteTeams(newTeams);

  return newTeams;
};

export const isFavoriteTeam = (teamId) => {
  return getFavoriteTeams().some(
    (team) => String(team.id) === String(teamId)
  );
};
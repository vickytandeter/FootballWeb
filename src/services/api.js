import axios from "axios";

const API_KEY = "f6904af7c697fc979260faf91f58acf7";
const BASE_URL = "https://v3.football.api-sports.io";

export const getTeam = async (teamId) => {
  const res = await axios.get(`${BASE_URL}/teams`, {
    params: {
      id: teamId,
    },
    headers: {
      "x-apisports-key": API_KEY,
    },
  });
  return res.data;
};

export const getPlayerProfile = async (playerId) => {
  const res = await axios.get(`${BASE_URL}/players/profiles`, {
    params: {
      player: playerId,
    },
    headers: {
      "x-apisports-key": API_KEY,
    },
  });
  return res.data;
};
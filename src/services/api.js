import axios from "axios";

const API_KEY = "f6904af7c697fc979260faf91f58acf7";
const BASE_URL = "https://v3.football.api-sports.io";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "x-apisports-key": API_KEY },
});

export const getLiveFixtures = async () => {
  const res = await api.get("/fixtures", { params: { live: "all" } });
  return res.data.response;
};
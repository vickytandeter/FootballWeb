import { useState, useEffect } from "react";
import { getFixturesByDate } from "../../services/api";
import MatchCard from "./MatchCard";
import "../estilo/WeekMatches.css";

const CACHE_KEY = "wm_days_cache_espn_v2";

function getAvailableDates() {
  const today = new Date();
  const dates = [];
  for (let offset = -1; offset <= 1; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatTitle(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const str = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short" });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function readCache(cacheKey) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.cacheKey !== cacheKey || !Array.isArray(parsed.groups)) return null;
    const isValidShape = parsed.groups.every(
      (g) => Array.isArray(g.recent) && Array.isArray(g.upcoming)
    );
    return isValidShape ? parsed.groups : null;
  } catch {
    return null;
  }
}

function writeCache(cacheKey, groups) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ cacheKey, groups }));
  } catch (err) {
    console.warn("No se pudo guardar el cache de partidos:", err);
  }
}

export default function WeekMatches({ favoriteIds, onToggleFavorite }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allDates = getAvailableDates();
  const cacheKey = allDates.join(",");
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let cancelled = false;

    const cached = readCache(cacheKey);
    if (cached) {
      setGroups(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all(allDates.map((d) => getFixturesByDate(d)))
      .then((results) => {
        if (cancelled) return;
        const g = [];
        allDates.forEach((dateStr, i) => {
          const dayMatches = results[i] || [];
          const recent = dayMatches.filter((m) => m.status.state === "post");
          const upcoming = dayMatches.filter((m) => m.status.state === "pre");

          if (recent.length > 0 || upcoming.length > 0) {
            g.push({
              date: dateStr,
              title: formatTitle(dateStr),
              isToday: dateStr === todayStr,
              recent,
              upcoming,
            });
          }
        });
        setGroups(g);
        writeCache(cacheKey, g);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  if (loading) {
    return (
      <div className="wm-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="wm-loadingSection">
            <div className="wm-loadingTitle" />
            <div className="wm-loadingCards">
              <div className="wm-loadingCard" />
              <div className="wm-loadingCard" />
              <div className="wm-loadingCard" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="wm-error">Error al cargar partidos: {error}</div>;
  }

  const recentGroups = groups
    .filter((group) => (group.recent?.length ?? 0) > 0)
    .map((group) => ({ ...group, matches: group.recent }));

  const upcomingGroups = groups
    .filter((group) => (group.upcoming?.length ?? 0) > 0)
    .map((group) => ({ ...group, matches: group.upcoming }));

  if (recentGroups.length === 0 && upcomingGroups.length === 0) {
    return <div className="wm-empty">No hay partidos en estos días.</div>;
  }

  const renderGroup = (group) => (
    <div key={group.date} className={`wm-section ${group.isToday ? "wm-today" : ""}`}>
      <div className="wm-dateTitle">
        <span className="wm-dateText">{group.title}</span>
        {group.isToday && <span className="wm-todayBadge">Hoy</span>}
      </div>
      <div className="wm-grid">
        {group.matches.map((match) => (
          <MatchCard
            key={match.id}
            fixture={match}
            isFav={favoriteIds?.includes(match.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="wm-container">
      {recentGroups.length > 0 && (
        <div className="wm-group">
          <h2 className="home-matches__title wm-group-title">
            🕓 Partidos Recientes
          </h2>
          {recentGroups.map(renderGroup)}
        </div>
      )}

      {upcomingGroups.length > 0 && (
        <div className="wm-group">
          <h2 className="home-matches__title wm-group-title">
            📅 Próximos Partidos
          </h2>
          {upcomingGroups.map(renderGroup)}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Heart,
  Star,
  Radio,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  getLiveFixtures,
  getTeamFixtures,
  getLeagueFixtures,
} from "../services/api";
import {
  addFavoriteTeam,
  removeFavoriteTeam,
  isFavoriteTeam,
  addFavoriteLeague,
  removeFavoriteLeague,
  isFavoriteLeague,
  getProfile,
} from "../services/storage";

function StatusBadge({ status }) {
  const isLive =
    status.short === "1H" ||
    status.short === "2H" ||
    status.short === "HT" ||
    status.short === "ET" ||
    status.short === "P" ||
    status.short === "BT" ||
    status.short === "LIVE";

  return (
    <Badge
      variant={isLive ? "destructive" : "secondary"}
      className={`text-[10px] font-bold uppercase tracking-wider ${
        isLive ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : ""
      }`}
    >
      {isLive && <Radio className="mr-1 h-2.5 w-2.5" />}
      {status.short === "HT"
        ? "Entretiempo"
        : status.short === "1H"
          ? `${status.elapsed ?? ""}' 1T`
          : status.short === "2H"
            ? `${status.elapsed ?? ""}' 2T`
            : status.short === "ET"
              ? `${status.elapsed ?? ""}' ET`
              : status.short === "P"
                ? "Penales"
                : status.short === "BT"
                  ? "Descanso ET"
                  : status.long}
    </Badge>
  );
}

function MatchCard({ fixture, onFavoritesChanged }) {
  const [favHome, setFavHome] = useState(false);
  const [favAway, setFavAway] = useState(false);
  const [favLeague, setFavLeague] = useState(false);

  useEffect(() => {
    setFavHome(isFavoriteTeam(fixture.teams.home.id));
    setFavAway(isFavoriteTeam(fixture.teams.away.id));
    setFavLeague(isFavoriteLeague(fixture.league.id));
  }, [fixture]);

  const toggleTeamFav = (teamId, isHome) => {
    if (isFavoriteTeam(teamId)) {
      removeFavoriteTeam(teamId);
      if (isHome) setFavHome(false);
      else setFavAway(false);
    } else {
      addFavoriteTeam(teamId);
      if (isHome) setFavHome(true);
      else setFavAway(true);
    }
    onFavoritesChanged();
  };

  const toggleLeagueFav = (leagueId) => {
    if (isFavoriteLeague(leagueId)) {
      removeFavoriteLeague(leagueId);
      setFavLeague(false);
    } else {
      addFavoriteLeague(leagueId);
      setFavLeague(true);
    }
    onFavoritesChanged();
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2 min-w-0">
          {fixture.league.logo ? (
            <img
              src={fixture.league.logo}
              alt={fixture.league.name}
              className="h-4 w-4 object-contain flex-shrink-0"
            />
          ) : null}
          <span className="text-xs font-medium text-muted-foreground truncate">
            {fixture.league.name}
          </span>
          {fixture.league.country && (
            <span className="text-xs text-muted-foreground/70 hidden sm:inline">
              {fixture.league.country}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => toggleLeagueFav(fixture.league.id)}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Favoritar liga"
          >
            <Star
              className={`h-3.5 w-3.5 transition-colors ${
                favLeague
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground hover:text-yellow-500"
              }`}
            />
          </button>
          <StatusBadge status={fixture.fixture.status} />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              onClick={() => toggleTeamFav(fixture.teams.home.id, true)}
              className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Favoritar equipo local"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  favHome
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground/40 hover:text-red-400"
                }`}
              />
            </button>
            {fixture.teams.home.logo ? (
              <img
                src={fixture.teams.home.logo}
                alt={fixture.teams.home.name}
                className="h-8 w-8 object-contain flex-shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                {fixture.teams.home.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-semibold truncate">
              {fixture.teams.home.name}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-bold tabular-nums min-w-[28px] text-center">
              {fixture.goals.home ?? 0}
            </span>
            <span className="text-lg font-light text-muted-foreground">-</span>
            <span className="text-2xl font-bold tabular-nums min-w-[28px] text-center">
              {fixture.goals.away ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span className="text-sm font-semibold truncate text-right">
              {fixture.teams.away.name}
            </span>
            {fixture.teams.away.logo ? (
              <img
                src={fixture.teams.away.logo}
                alt={fixture.teams.away.name}
                className="h-8 w-8 object-contain flex-shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                {fixture.teams.away.name.charAt(0)}
              </div>
            )}
            <button
              onClick={() => toggleTeamFav(fixture.teams.away.id, false)}
              className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Favoritar equipo visitante"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  favAway
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground/40 hover:text-red-400"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {new Date(fixture.fixture.date).toLocaleString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
              day: "numeric",
              month: "short",
            })}
          </span>
          {fixture.fixture.referee && (
            <>
              <span className="mx-1">|</span>
              <span className="truncate">{fixture.fixture.referee}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MatchSkeleton() {
  return (
    <Card className="border-border/60">
      <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-8 w-20" />
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-3 h-3 w-40" />
      </CardContent>
    </Card>
  );
}

export default function LiveMatches({
  filter,
  showFavoritesOnly,
  onFavoritesChanged,
}) {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchFixtures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (filter) {
        if (filter.type === "team") {
          data = await getTeamFixtures(filter.id, true);
        } else {
          data = await getLeagueFixtures(filter.id, true);
        }
      } else {
        data = await getLiveFixtures();
      }

      if (showFavoritesOnly) {
        const profile = getProfile();
        data = data.filter(
          (f) =>
            profile.favoriteTeamIds.includes(f.teams.home.id) ||
            profile.favoriteTeamIds.includes(f.teams.away.id) ||
            profile.favoriteLeagueIds.includes(f.league.id)
        );
      }

      setFixtures(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch fixtures:", err);
      setError("No se pudieron cargar los partidos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [filter, showFavoritesOnly]);

  useEffect(() => {
    fetchFixtures();
    const interval = setInterval(fetchFixtures, 60000);
    return () => clearInterval(interval);
  }, [fetchFixtures]);

  return (
    <section aria-label="Partidos en vivo">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-500" />
            Partidos en Vivo
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filter
              ? `Filtrando por ${filter.type === "team" ? "equipo" : "liga"}: ${filter.name}`
              : "Todos los partidos en juego ahora"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Actualizado: {lastUpdated.toLocaleTimeString("es-AR")}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFixtures}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        </div>
      </div>

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <MatchSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <Card className="p-8 text-center">
          <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchFixtures}
          >
            Reintentar
          </Button>
        </Card>
      )}

      {!loading && !error && fixtures.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Radio className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">
            {showFavoritesOnly
              ? "Sin partidos favoritos en vivo"
              : filter
                ? "Sin partidos para este filtro"
                : "No hay partidos en vivo"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {showFavoritesOnly
              ? "Agrega equipos o ligas a tus favoritos para verlos aquí."
              : filter
                ? "Intenta buscar otro equipo o liga, o limpia el filtro."
                : "Los partidos en vivo aparecerán aquí automáticamente cuando comiencen."}
          </p>
        </Card>
      )}

      {!loading && !error && fixtures.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {fixtures.length} {fixtures.length === 1 ? "partido" : "partidos"}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fixtures.map((f) => (
              <MatchCard
                key={f.fixture.id}
                fixture={f}
                onFavoritesChanged={onFavoritesChanged}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
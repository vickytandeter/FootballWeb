import axios from "axios";

const BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer";
const STANDINGS_URL = "https://site.api.espn.com/apis/v2/sports/soccer";

const api = axios.create({ baseURL: BASE_URL });

export const LEAGUES = [
  { code: "eng.1", name: "Premier League" },
  { code: "esp.1", name: "La Liga" },
  { code: "ger.1", name: "Bundesliga" },
  { code: "ita.1", name: "Serie A" },
  { code: "fra.1", name: "Ligue 1" },
  { code: "arg.1", name: "Liga Profesional Argentina" },
  { code: "conmebol.libertadores", name: "Copa Libertadores" },
];

function leagueName(code) {
  return LEAGUES.find((l) => l.code === code)?.name || code;
}

function teamLogo(team) {
  return team?.logo || team?.logos?.[0]?.href || null;
}

function normalizeEvent(ev, leagueCode) {
  const comp = ev.competitions?.[0];
  const home = comp?.competitors?.find((c) => c.homeAway === "home");
  const away = comp?.competitors?.find((c) => c.homeAway === "away");
  const statusType = comp?.status?.type || ev.status?.type || {};

  return {
    id: ev.id,
    leagueCode: match.leagueCode,
    date: ev.date || comp?.date || comp?.startDate || null,
    venue: comp?.venue?.fullName || comp?.venue?.displayName || null,
    status: {
      state: statusType.state,
      completed: statusType.completed,
      detail: statusType.shortDetail,
      clock: comp?.status?.displayClock,
    },
    home: {
      id: home?.team?.id,
      name: home?.team?.displayName,
      logo: teamLogo(home?.team),
      score: home?.score != null ? Number(home.score) : null,
    },
    away: {
      id: away?.team?.id,
      name: away?.team?.displayName,
      logo: teamLogo(away?.team),
      score: away?.score != null ? Number(away.score) : null,
    },
  };
}

async function getFixturesByDateAndLeague(date, leagueCode) {
  const compact = date.replaceAll("-", "");
  const { data } = await api.get(`/${leagueCode}/scoreboard`, {
    params: { dates: compact },
  });
  return (data.events || []).map((ev) => normalizeEvent(ev, leagueCode));
}

export async function getFixturesByDate(date) {
  const results = await Promise.all(
    LEAGUES.map((l) => getFixturesByDateAndLeague(date, l.code))
  );
  return results.flat();
}

export const getLiveFixtures = async () => {
  const today = new Date().toISOString().split("T")[0];
  const all = await getFixturesByDate(today);
  return all.filter((m) => m.status.state === "in");
};

export async function getFixtureDetail(leagueCode, id) {
  const { data } = await api.get(`/${leagueCode}/summary`, {
    params: { event: id },
  });

  const headerEvent = data.header || {};
  const match = normalizeEvent(headerEvent, leagueCode);

  const events = (data.keyEvents || [])
    .map((ev, idx) => {
      const typeText = ev.type?.text || "";
      const text = ev.text || "";
      const shortText = ev.shortText || "";

      const combinedText = `${typeText} ${text} ${shortText}`.toLowerCase();

      if (
        combinedText.includes("delay in match") ||
        combinedText.includes("delay over") ||
        combinedText.includes("start delay") ||
        combinedText.includes("end delay")
      ) {
        return null;
      }

      const isSubstitution = combinedText.includes("substitution");

      const isGoal =
        ev.scoringPlay === true ||
        combinedText.includes("goal!");

      let player = "";
      let playerOut = "";
      let playerIn = "";

      if (isGoal) {
        player = shortText
          .replace(/\s*Goal\s*$/i, "")
          .trim();

        if (!player) {
          const goalMatch = text.match(
            /^Goal!.*?\.\s*([^()]+?)\s*\(/i
          );

          player = goalMatch?.[1]?.trim() || "";
        }
      }

      if (isSubstitution) {
        playerIn = shortText
          .replace(/\s*Substitution\s*$/i, "")
          .trim();

        const replacesMatch = text.match(
          /replaces\s+(.+?)(?:\s+because\b|\.)/i
        );

        if (replacesMatch) {
          playerOut = replacesMatch[1].trim();
        }

        if (!playerOut) {
          const fallbackMatch = text.match(
            /replaces\s+(.+)$/i
          );

          if (fallbackMatch) {
            playerOut = fallbackMatch[1]
              .replace(/\s+because.*$/i, "")
              .replace(/\.$/, "")
              .trim();
          }
        }
      }

      return {
        id: ev.id || idx,
        minute: ev.clock?.displayValue || ev.time?.displayValue || "",

        typeText: isSubstitution
          ? "Substitution"
          : isGoal
            ? "Goal"
            : typeText || text,

        teamId: ev.team?.id || null,

        player,

        playerIn,
        playerOut,

        isSubstitution,
        isGoal,
      };
    })
  .filter(Boolean);

  const lineups = (data.rosters || []).map((teamRoster) => {
    const roster = teamRoster.roster || teamRoster.athletes || [];
    const teamId = teamRoster.team?.id;

    const subsWhoEntered = new Set();

    const mapPlayer = (p) => ({
      id: p.athlete?.id,
      name: p.athlete?.displayName,
      position: p.position?.abbreviation,
      jersey: p.jersey || p.athlete?.jersey || null,
      enteredAsSub: subsWhoEntered.has(p.athlete?.displayName),
    });

    return {
      teamId,
      teamName: teamRoster.team?.displayName,
      teamLogo: teamLogo(teamRoster.team),
      formation: teamRoster.formation?.name,

      starters: roster
        .filter((p) => p.starter === true || p.formationPlace)
        .map(mapPlayer),

      substitutes: roster
        .filter((p) => p.starter !== true && !p.formationPlace)
        .map(mapPlayer),
    };
  });

  return { match, events, lineups };
}

export async function getStandings(leagueCode) {
  const { data } = await axios.get(
    `${STANDINGS_URL}/${leagueCode}/standings`
  );

  const groups = data.children?.length
    ? data.children
    : data.standings
      ? [{ standings: data.standings }]
      : [];

  const entries = groups.flatMap(
    (g) => g.standings?.entries || []
  );

  const standings = entries.map((entry, idx) => {
    const statByName = (names) => {
      const stat = entry.stats?.find((s) =>
        names.includes((s.name || "").toLowerCase())
      );

      return stat ? Number(stat.value) : null;
    };

    return {
      rank: statByName(["rank"]) ?? idx + 1,
      teamId: entry.team?.id,
      teamName: entry.team?.displayName,
      teamLogo: entry.team?.logo,
      played: statByName(["gamesplayed"]),
      win: statByName(["wins"]),
      draw: statByName(["ties", "draws"]),
      lose: statByName(["losses"]),
      goalsDiff: statByName([
        "pointdifferential",
        "goaldifferential",
      ]),
      points: statByName(["points"]),
    };
  });

  return standings
    .sort((a, b) => a.rank - b.rank)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
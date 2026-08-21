import { useState, useEffect } from 'react';
import { getStandings } from '../../services/api';

export default function StandingsTab({ leagueCode, homeTeamId, awayTeamId }) {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leagueCode) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    getStandings(leagueCode)
      .then((data) => {
        if (!cancelled) {
          setStandings(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStandings(null);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [leagueCode]);

  if (loading) {
    return (
      <div className="md-standingsLoading">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="md-standingsSkeletonRow" />
        ))}
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="md-emptyTab">
        No hay tabla de posiciones disponible para esta competencia.
      </div>
    );
  }

  return (
    <div className="md-standingsTable">
      <div className="md-standingsHeader">
        <span className="md-stPos">#</span>
        <span className="md-stTeam">Equipo</span>
        <span className="md-stCell">PJ</span>
        <span className="md-stCell">G</span>
        <span className="md-stCell">E</span>
        <span className="md-stCell">P</span>
        <span className="md-stCell">DG</span>
        <span className="md-stCell">Pts</span>
      </div>
      {standings.map((entry) => {
        const isRelevant =
          String(entry.teamId) === String(homeTeamId) || String(entry.teamId) === String(awayTeamId);
        return (
          <div key={entry.teamId} className={`md-standingsRow ${isRelevant ? 'md-standingsHighlight' : ''}`}>
            <span className="md-stPos">{entry.rank}</span>
            <span className="md-stTeam">
              {entry.teamLogo && <img src={entry.teamLogo} alt="" className="md-stTeamLogo" />}
              {entry.teamName}
            </span>
            <span className="md-stCell">{entry.played ?? '-'}</span>
            <span className="md-stCell">{entry.win ?? '-'}</span>
            <span className="md-stCell">{entry.draw ?? '-'}</span>
            <span className="md-stCell">{entry.lose ?? '-'}</span>
            <span className={`md-stCell ${entry.goalsDiff > 0 ? 'md-positive' : entry.goalsDiff < 0 ? 'md-negative' : ''}`}>
              {entry.goalsDiff != null ? (entry.goalsDiff > 0 ? '+' : '') + entry.goalsDiff : '-'}
            </span>
            <span className="md-stCell md-stPoints">{entry.points ?? '-'}</span>
          </div>
        );
      })}
    </div>
  );
}
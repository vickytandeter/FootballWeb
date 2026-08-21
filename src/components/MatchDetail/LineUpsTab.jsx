export default function LineupsTab({ lineups }) {
  if (!lineups || lineups.length === 0) {
    return <div className="md-emptyTab">No hay alineaciones disponibles para este partido.</div>;
  }

  return (
    <div className="md-lineupsContainer">
      {lineups.map((team) => (
        <div key={team.teamId} className="md-lineupColumn">
          <div className="md-lineupHeader">
            {team.teamLogo && <img src={team.teamLogo} alt="" className="md-lineupTeamLogo" />}
            <div>
              <span className="md-lineupTeamName">{team.teamName}</span>
              {team.formation && <span className="md-formation">{team.formation}</span>}
            </div>
          </div>

          <div className="md-playersList">
            <div className="md-playersSectionTitle">Titulares</div>
            {team.starters.length === 0 && (
              <div className="md-playersSectionTitle">No disponible</div>
            )}
            {team.starters.map((p, idx) => (
              <div key={p.id || idx} className="md-playerRow">
                <span className="md-playerPos">{p.position || '-'}</span>
                <span className="md-playerName">{p.name}</span>
                <span className="md-playerJersey">{p.jersey ?? '-'}</span>
              </div>
            ))}

            {team.substitutes.length > 0 && (
              <>
                <div className="md-playersSectionTitle">Suplentes</div>
                {team.substitutes.map((p, idx) => (
                  <div key={p.id || idx} className="md-playerRow">
                    <span className="md-playerPos">{p.position || '-'}</span>
                    <span className="md-playerName">
                      {p.name}
                      {p.enteredAsSub && (
                        <span className="md-subInArrow" title="Ingresó durante el partido">
                          ↑
                        </span>
                      )}
                    </span>
                    <span className="md-playerJersey">{p.jersey ?? '-'}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
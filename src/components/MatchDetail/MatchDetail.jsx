import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFixtureDetail } from '../../services/api';
import ScoreHeader from './ScoreHeader';
import EventsTab from './EventsTab';
import LineupsTab from './LineUpsTab';
import StandingsTab from './StandingsTab';
import '../estilo/MatchDetail.css';

export default function MatchDetail() {
  const { leagueCode, id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    if (!id || !leagueCode) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getFixtureDetail(leagueCode, id)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Error al cargar');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [leagueCode, id]);

  if (loading) {
    return (
      <div className="md-container">
        <button className="md-backBtn" onClick={() => navigate('/')}>&#8592; Volver</button>
        <div className="md-loadingSkeleton">
          <div className="md-skelHeader" />
          <div className="md-skelTabs" />
          <div className="md-skelContent" />
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="md-container">
        <button className="md-backBtn" onClick={() => navigate('/')}>&#8592; Volver</button>
        <div className="md-errorState">
          <span>&#9888;</span>
          <p>{error || 'No se encontro el partido'}</p>
        </div>
      </div>
    );
  }

  const { match, events, lineups } = detail;

  const tabs = [
    { key: 'events', label: 'Eventos' },
    { key: 'lineups', label: 'Alineaciones' },
    { key: 'standings', label: 'Posiciones' },
  ];

  return (
    <div className="md-container">
      <button className="md-backBtn" onClick={() => navigate('/')}>&#8592; Volver</button>

      <ScoreHeader match={match} />

      <div className="md-tabsBar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`md-tabBtn ${activeTab === tab.key ? 'md-tabActive' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'events' && events.length > 0 && (
              <span className="md-tabCount">{events.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="md-tabContent">
        {activeTab === 'events' && <EventsTab events={events} homeTeamId={match.home.id} />}
        {activeTab === 'lineups' && <LineupsTab lineups={lineups} />}
        {activeTab === 'standings' && (
          <StandingsTab
            leagueCode={leagueCode}
            homeTeamId={match.home.id}
            awayTeamId={match.away.id}
          />
        )}
      </div>
    </div>
  );
}
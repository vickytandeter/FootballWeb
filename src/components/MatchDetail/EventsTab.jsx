import EventContent from './EventContent';
import { groupByMinute, splitRow } from '../../services/events';

export default function EventsTab({ events, homeTeamId }) {
  if (!events || events.length === 0) {
    return <div className="md-emptyTab">No hay eventos disponibles para este partido.</div>;
  }

  const rows = groupByMinute(events);

  return (
    <div className="md-timeline">
      {rows.map(({ minute, events: evs }) => {
        const { home, away, shared } = splitRow(evs, homeTeamId);
        return (
          <div key={minute || "sin-minuto"} className="md-eventRow">
            <div className="md-eventSide md-eventSide--home">
              {home.map((ev) => (
                <EventContent key={ev.id} ev={ev} />
              ))}
            </div>
            <div className="md-eventMinuteCol">
              <span className="md-eventMinute">{minute}</span>
              {shared.map((ev) => (
                <span key={ev.id} className="md-eventShared">
                  {ev.player || ev.typeText}
                </span>
              ))}
            </div>
            <div className="md-eventSide md-eventSide--away">
              {away.map((ev) => (
                <EventContent key={ev.id} ev={ev} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
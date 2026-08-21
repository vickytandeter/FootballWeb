export default function EventContent({ ev }) {
  return (
    <div className="md-eventItem">
      <span className="md-eventText">{ev.player || ev.typeText}</span>
      {ev.typeText && ev.player && <span className="md-eventDetail">{ev.typeText}</span>}
    </div>
  );
}
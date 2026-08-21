export default function EventContent({ ev }) {
  if (ev.isSubstitution) {
    return (
        <div className="md-eventItem">
        <span className="md-eventText">
            Substitution
        </span>

        <span className="md-eventDetail">
            ↑ {ev.playerIn || "Unknown"} · ↓ {ev.playerOut || "Unknown"}
        </span>
        </div>
    );
  }

  if (ev.isGoal) {
    return (
      <div className="md-eventItem md-eventGoal">
        <span className="md-eventText">
          Goal - {ev.player || "Unknown"}
        </span>
      </div>
    );
  }

  return (
    <div className="md-eventItem">
      <span className="md-eventText">
        {ev.player || ev.typeText}
      </span>

      {ev.typeText && ev.player && (
        <span className="md-eventDetail">
          {ev.typeText}
        </span>
      )}
    </div>
  );
}
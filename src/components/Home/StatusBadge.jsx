import "../estilo/StatusBadge.css";

const StatusBadge = ({ status }) => {
  const { state, clock } = status;
  const isLive = state === "in";

  const label = isLive ? "En Vivo" : state === "post" ? "Finalizado" : "Programado";

  return (
    <span className={`status-badge ${isLive ? "status-live" : "status-default"}`}>
      {isLive && <span className="status-dot" />}
      {isLive && clock ? `${clock} ` : ""}
      {label}
    </span>
  );
};

export default StatusBadge;
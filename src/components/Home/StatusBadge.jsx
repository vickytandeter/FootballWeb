import "../estilo/StatusBadge.css";

const STATUS_MAP = {
  "1H": "1er Tiempo",
  "2H": "2do Tiempo",
  HT: "Entretiempo",
  ET: "Tiempo Extra",
  BT: "Descanso ET",
  P: "Penales",
  LIVE: "En Vivo",
};

const StatusBadge = ({ status }) => {
  const { short, elapsed } = status;
  const isLive = ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"].includes(short);
  const label = STATUS_MAP[short] || short;

  return (
    <span className={`status-badge ${isLive ? "status-live" : "status-default"}`}>
      {isLive && <span className="status-dot" />}
      {elapsed != null && isLive ? `${elapsed}' ` : ""}
      {label}
    </span>
  );
};

export default StatusBadge;
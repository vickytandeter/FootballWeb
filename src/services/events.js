// Agrupa los eventos que pasaron en el mismo minuto en un solo renglón
export function groupByMinute(events) {
  const order = [];
  const map = new Map();
  events.forEach((ev) => {
    const key = ev.minute || "";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(ev);
  });
  return order.map((minute) => ({ minute, events: map.get(minute) }));
}

// Separa los eventos de un renglón en local / visitante / compartido.
// "Compartido" son eventos sin equipo asignado, o el mismo evento
// duplicado para los dos equipos (se muestra una sola vez, al medio).
export function splitRow(evs, homeTeamId) {
  const home = [];
  const away = [];
  const shared = [];

  evs.forEach((ev) => {
    if (!ev.teamId) {
      shared.push(ev);
    } else if (String(ev.teamId) === String(homeTeamId)) {
      home.push(ev);
    } else {
      away.push(ev);
    }
  });

  for (let hi = home.length - 1; hi >= 0; hi--) {
    const h = home[hi];
    const ai = away.findIndex((a) => a.typeText === h.typeText && a.player === h.player);
    if (ai !== -1) {
      shared.push(h);
      home.splice(hi, 1);
      away.splice(ai, 1);
    }
  }

  return { home, away, shared };
}
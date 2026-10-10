// fpl.js
// Henter og forenkler data fra det officielle Fantasy Premier League API.

const BASE_URL = "https://fantasy.premierleague.com/api";

// element_type: 1 = målmand, 2 = forsvar, 3 = midtbane, 4 = angreb
const POSITIONS = { 1: "MV", 2: "FOR", 3: "MID", 4: "ANG" };
const formatPrice = (nowCost) => `£${(nowCost / 10).toFixed(1)}m`;

// Henter alle spillere og mapper dem til pæne, enkle objekter.
export async function getAllPlayers() {
  const res = await fetch(`${BASE_URL}/bootstrap-static/`);
  if (!res.ok) {
    throw new Error(`Kunne ikke hente data (status ${res.status})`);
  }
  const data = await res.json();

  // Opslag fra klub-id til kort klubnavn (fx "ARS").
  const teamsById = {};
  data.teams.forEach((team) => {
    teamsById[team.id] = team.short_name;
  });

  return data.elements.map((p) => ({
    id: p.id,
    name: p.web_name,
    position: POSITIONS[p.element_type] || "?",
    team: teamsById[p.team] || "",
    price: formatPrice(p.now_cost),
    points: p.total_points,
    form: parseFloat(p.form) || 0,
  }));
}

// "Dagens tips": de spillere der er i bedst form lige nu.
export async function getTips() {
  const players = await getAllPlayers();
  return [...players].sort((a, b) => b.form - a.form).slice(0, 10);
}

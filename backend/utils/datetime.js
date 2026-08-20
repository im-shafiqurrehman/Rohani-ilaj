const TIME_ZONE = "Asia/Karachi";
const TIME_ZONE_LABEL = "PKT";

const DATE_OPTS = { day: "2-digit", month: "short", year: "numeric", timeZone: TIME_ZONE };
const TIME_OPTS = { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TIME_ZONE };

function toDate(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "20 Aug 2026, 11:00 PM \u2013 11:30 PM (PKT)" */
function formatSlotRange(start, end) {
  const s = toDate(start);
  if (!s) return null;
  const date = s.toLocaleDateString("en-GB", DATE_OPTS);
  const from = s.toLocaleTimeString("en-US", TIME_OPTS);
  const e = toDate(end);
  if (!e) return `${date}, ${from} (${TIME_ZONE_LABEL})`;
  return `${date}, ${from} \u2013 ${e.toLocaleTimeString("en-US", TIME_OPTS)} (${TIME_ZONE_LABEL})`;
}

module.exports = { formatSlotRange, TIME_ZONE, TIME_ZONE_LABEL };

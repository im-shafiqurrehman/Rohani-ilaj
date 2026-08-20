export const TIME_ZONE = "Asia/Karachi";
export const TIME_ZONE_LABEL = "PKT";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
};

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true, // 11:00 PM, never 23:00
  timeZone: TIME_ZONE,
};

function toDate(value?: string | Date | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "20 Aug 2026" */
export function formatDate(value?: string | Date | null) {
  const d = toDate(value);
  return d ? d.toLocaleDateString("en-GB", DATE_OPTS) : "—";
}

/** "11:00 PM" */
export function formatTime(value?: string | Date | null) {
  const d = toDate(value);
  return d ? d.toLocaleTimeString("en-US", TIME_OPTS) : "—";
}

/** "20 Aug 2026, 11:00 PM" */
export function formatDateTime(value?: string | Date | null) {
  const d = toDate(value);
  if (!d) return "—";
  return `${d.toLocaleDateString("en-GB", DATE_OPTS)}, ${d.toLocaleTimeString("en-US", TIME_OPTS)}`;
}

export function formatSlotRange(
  start?: string | Date | null,
  end?: string | Date | null
) {
  const s = toDate(start);
  if (!s) return "—";

  const date = s.toLocaleDateString("en-GB", DATE_OPTS);
  const from = s.toLocaleTimeString("en-US", TIME_OPTS);
  const e = toDate(end);

  if (!e) return `${date}, ${from} (${TIME_ZONE_LABEL})`;

  const to = e.toLocaleTimeString("en-US", TIME_OPTS);
  return `${date}, ${from} to ${to} (${TIME_ZONE_LABEL})`;
}

/**
 * Normalises the many ways Pakistani numbers get typed (+92, 0092, 0317…)
 * down to one comparable form, so the admin panel doesn't show duplicates and
 * a guest booking can be matched to an account created later.
 */
function normalisePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("92")) return "0" + digits.slice(2);
  if (digits.startsWith("0")) return digits;
  return "0" + digits;
}

module.exports = { normalisePhone };

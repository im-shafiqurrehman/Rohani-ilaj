/*
 * Pakistani mobile numbers, normalised to one canonical form: 03XXXXXXXXX.
 *
 * People type these many ways: 0300 1234567, +92 300 1234567, 00923001234567,
 * 3001234567, with dashes or spaces. All of those are the same number, and the
 * admin panel should not show four variants of one customer.
 *
 * Valid mobile prefixes are 030 to 034 (Jazz/Warid, Zong, Ufone, Telenor) and
 * 035 (SCO, Azad Kashmir and Gilgit-Baltistan).
 */
const PK_MOBILE = /^03[0-5]\d{8}$/;

/** Canonical 03XXXXXXXXX, or "" if the input cannot be read as one. */
function normalisePhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  // At this point we expect the national number: 3XXXXXXXXX (10 digits).
  if (digits.length !== 10) return "";
  return "0" + digits;
}

/** True only for a real Pakistani mobile number. */
function isValidPkMobile(raw) {
  return PK_MOBILE.test(normalisePhone(raw));
}

/** +923XXXXXXXXX, for wa.me links and display. */
function toInternational(raw) {
  const n = normalisePhone(raw);
  return n ? "+92" + n.slice(1) : "";
}

module.exports = { normalisePhone, isValidPkMobile, toInternational, PK_MOBILE };

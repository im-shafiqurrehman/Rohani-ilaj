/** Mirrors backend/utils/phone.js so the browser rejects a bad number before
 *  a round trip, and the server still rejects it if the browser is bypassed. */
const PK_MOBILE = /^03[0-5]\d{8}$/;

export function normalisePhone(raw: string): string {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 10) return "";
  return "0" + digits;
}

export const isValidPkMobile = (raw: string) => PK_MOBILE.test(normalisePhone(raw));

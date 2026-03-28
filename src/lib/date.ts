/**
 * Elite World-Class Date Utility for RMP Digitals
 * Synchronized with Asia/Jakarta (WIB) for absolute situational awareness.
 */

export function getJakartaDate(): Date {
  // Returns current date/time adjusted to Jakarta (UTC+7)
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
}

export function formatWIBTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta"
  }).format(d) + " WIB";
}

export function formatIndonesianDate(date: Date | string | number, long: boolean = true): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(d);
}

export function getTodayJakarta(): Date {
  const d = getJakartaDate();
  d.setHours(0, 0, 0, 0);
  return d;
}

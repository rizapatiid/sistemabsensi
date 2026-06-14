/**
 * Elite World-Class Date Utility for RMP Digitals
 * Optimized for Serverless Environments (Vercel)
 * Menjamin sinkronisasi WIB (UTC+7) yang akurat di Local maupun Production.
 */

// 1. Ambil waktu asli (UTC) - Ini standar terbaik untuk aplikasi Cloud
export function getJakartaDate(): Date {
  return new Date();
}

// 2. Formatter Waktu (WIB) - Satu-satunya tempat konversi +7 jam dilakukan
export function formatWIBTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta"
  }).format(d) + " WIB";
}

// 3. Formatter Tanggal Indonesia
export function formatIndonesianDate(date: Date | string | number, long: boolean = true): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(d);
}

// 4. Logika Critical: Ambil batas "Hari Ini" tepat di jam 00:00 Jakarta
export function getTodayJakarta(): Date {
  const now = new Date();
  // Bridge ke Jakarta hanya untuk menentukan "Tanggal Hari Ini" di Jakarta
  const jktStr = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  const jkt = new Date(jktStr);
  
  // Buat objek Date UTC murni untuk jam 00:00 di tanggal tersebut
  return new Date(Date.UTC(jkt.getFullYear(), jkt.getMonth(), jkt.getDate()));
}

/**
 * Generate SQL INSERT statements dari data-export JSON
 * Jalankan: node scripts/generate-import-sql.js
 * Output: scripts/data-export/import-data.sql
 * Lalu jalankan SQL tersebut di phpMyAdmin Hostinger
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data-export');
const OUTPUT_FILE = path.join(DATA_DIR, 'import-data.sql');

function readJson(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return val;
  // Format DateTime ke MySQL format
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
    // ISO string → MySQL DATETIME
    return `'${val.replace('T', ' ').replace(/\.\d{3}Z$/, '').replace('Z', '')}'`;
  }
  // Escape single quotes
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function genInsert(table, rows, cols) {
  if (rows.length === 0) return `-- (Tidak ada data untuk ${table})\n`;
  const lines = rows.map(row => {
    const vals = cols.map(c => esc(row[c])).join(', ');
    return `  (${vals})`;
  });
  return `INSERT IGNORE INTO \`${table}\` (${cols.map(c => `\`${c}\``).join(', ')}) VALUES\n${lines.join(',\n')};\n`;
}

const users = readJson('User');
const pushSubs = readJson('PushSubscription');
const attendances = readJson('Attendance');
const payrolls = readJson('Payroll');
const calendars = readJson('Calendar');
const announcements = readJson('Announcement');
const passwordResets = readJson('PasswordReset');
const messages = readJson('Message');
const systemSettings = readJson('SystemSetting');

let sql = `-- ============================================================
-- IMPORT DATA: Supabase → MySQL Hostinger
-- Generated: ${new Date().toISOString()}
-- Database: u500072377_absensirmp
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

`;

sql += `-- 1. User\n`;
sql += genInsert('User', users, [
  'id','nama','role','password','status','jabatan','phone','email',
  'alamat','rekeningBank','noRekening','namaRekening',
  'createdAt','updatedAt','emailNotifEnabled','lastSeenAnnouncement','absensiEnabled'
]);

sql += `\n-- 2. PushSubscription\n`;
sql += genInsert('PushSubscription', pushSubs, [
  'id','userId','endpoint','p256dh','auth','createdAt'
]);

sql += `\n-- 3. Attendance\n`;
// tanggal di Postgres adalah DATE, ambil hanya bagian tanggalnya
const attendancesFixed = attendances.map(a => ({
  ...a,
  tanggal: a.tanggal ? a.tanggal.split('T')[0] : null,
}));
sql += genInsert('Attendance', attendancesFixed, [
  'id','idKaryawan','tanggal','waktuMasuk','status','foto','buktiApp','alasan'
]);

sql += `\n-- 4. Payroll\n`;
sql += genInsert('Payroll', payrolls, [
  'id','idKaryawan','bulan','tahun','tipeGaji','jumlahAbsen',
  'gajiPokok','tunjangan','keteranganTunjangan','totalGaji',
  'bankSnapshot','noRekeningSnapshot','namaRekeningSnapshot',
  'createdAt','statusPembayaran','isRead'
]);

sql += `\n-- 5. Calendar\n`;
const calendarsFixed = calendars.map(c => ({
  ...c,
  tanggal: c.tanggal ? c.tanggal.split('T')[0] : null,
}));
sql += genInsert('Calendar', calendarsFixed, [
  'id','tanggal','keterangan','isHoliday','image'
]);

sql += `\n-- 6. Announcement\n`;
sql += genInsert('Announcement', announcements, [
  'id','judul','konten','image','scheduleDate','tanggal'
]);

sql += `\n-- 7. PasswordReset\n`;
sql += genInsert('PasswordReset', passwordResets, [
  'id','email','otp','expiresAt','createdAt'
]);

sql += `\n-- 8. Message\n`;
sql += genInsert('Message', messages, [
  'id','senderId','receiverId','content','isRead','createdAt'
]);

sql += `\n-- 9. SystemSetting\n`;
sql += genInsert('SystemSetting', systemSettings, [
  'id','maintenance','updatedAt','maintenanceReason','maintenanceUntil'
]);

sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;
sql += `\n-- ✅ Import selesai!\n`;

fs.writeFileSync(OUTPUT_FILE, sql, 'utf-8');

const totalRows = users.length + pushSubs.length + attendances.length + payrolls.length +
  calendars.length + announcements.length + passwordResets.length + messages.length + systemSettings.length;

console.log(`✅ SQL berhasil dibuat: ${OUTPUT_FILE}`);
console.log(`📊 Total data: ${totalRows} baris`);
console.log(`\nLangkah selanjutnya:`);
console.log(`1. Buka phpMyAdmin Hostinger`);
console.log(`2. Pilih database: u500072377_absensirmp`);
console.log(`3. Klik tab "SQL" atau "Impor"`);
console.log(`4. Copy-paste isi file import-data.sql dan jalankan`);

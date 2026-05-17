/**
 * STEP 3: Import data dari JSON ke MySQL
 * Jalankan dengan: node scripts/import-mysql.js
 *
 * PENTING: Jalankan ini SETELAH:
 * 1. schema.prisma sudah diupdate ke MySQL
 * 2. .env sudah diisi koneksi MySQL
 * 3. `npx prisma migrate dev` sudah berhasil
 * 4. `node scripts/export-supabase.js` sudah dijalankan
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, 'data-export');

function readJson(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File tidak ditemukan: ${name}.json (dilewati)`);
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Konversi string tanggal ke objek Date
function parseDates(obj, dateFields) {
  const result = { ...obj };
  for (const field of dateFields) {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  }
  return result;
}

async function importTable(name, fetcher) {
  const data = readJson(name);
  if (data.length === 0) return;

  let success = 0;
  let skip = 0;

  for (const row of data) {
    try {
      await fetcher(row);
      success++;
    } catch (e) {
      // Skip duplikat (unique constraint)
      if (e.code === 'P2002') {
        skip++;
      } else {
        console.error(`  ❌ Error pada ${name} id=${row.id}:`, e.message);
      }
    }
  }

  console.log(`✅ ${name}: ${success} berhasil, ${skip} dilewati (duplikat)`);
}

async function main() {
  console.log('🔄 Memulai import ke MySQL...\n');

  // 1. User (tidak ada FK)
  await importTable('User', (row) =>
    prisma.user.upsert({
      where: { id: row.id },
      update: {},
      create: parseDates(row, ['createdAt', 'updatedAt', 'lastSeenAnnouncement']),
    })
  );

  // 2. PushSubscription (FK: User)
  await importTable('PushSubscription', (row) =>
    prisma.pushSubscription.upsert({
      where: { endpoint: row.endpoint },
      update: {},
      create: parseDates(row, ['createdAt']),
    })
  );

  // 3. Attendance (FK: User)
  await importTable('Attendance', (row) =>
    prisma.attendance.upsert({
      where: { idKaryawan_tanggal: { idKaryawan: row.idKaryawan, tanggal: new Date(row.tanggal) } },
      update: {},
      create: parseDates(row, ['tanggal', 'waktuMasuk']),
    })
  );

  // 4. Payroll (FK: User)
  await importTable('Payroll', (row) =>
    prisma.payroll.upsert({
      where: { idKaryawan_bulan_tahun: { idKaryawan: row.idKaryawan, bulan: row.bulan, tahun: row.tahun } },
      update: {},
      create: parseDates(row, ['createdAt']),
    })
  );

  // 5. Calendar
  await importTable('Calendar', (row) =>
    prisma.calendar.upsert({
      where: { tanggal: new Date(row.tanggal) },
      update: {},
      create: parseDates(row, ['tanggal']),
    })
  );

  // 6. Announcement
  await importTable('Announcement', (row) =>
    prisma.announcement.upsert({
      where: { id: row.id },
      update: {},
      create: parseDates(row, ['scheduleDate', 'tanggal']),
    })
  );

  // 7. PasswordReset
  await importTable('PasswordReset', (row) =>
    prisma.passwordReset.upsert({
      where: { id: row.id },
      update: {},
      create: parseDates(row, ['expiresAt', 'createdAt']),
    })
  );

  // 8. Message (FK: User)
  await importTable('Message', (row) =>
    prisma.message.upsert({
      where: { id: row.id },
      update: {},
      create: parseDates(row, ['createdAt']),
    })
  );

  // 9. SystemSetting
  await importTable('SystemSetting', (row) =>
    prisma.systemSetting.upsert({
      where: { id: row.id },
      update: {},
      create: parseDates(row, ['updatedAt']),
    })
  );

  console.log('\n🎉 Import selesai! Semua data sudah masuk ke MySQL.');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

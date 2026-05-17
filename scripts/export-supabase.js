/**
 * STEP 1: Export semua data dari Supabase ke file JSON
 * Jalankan dengan: node scripts/export-supabase.js
 *
 * PENTING: Jalankan ini SEBELUM mengubah schema.prisma dan .env
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(__dirname, 'data-export');

async function main() {
  // Buat folder output
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🔄 Memulai export dari Supabase...\n');

  const exportTable = async (name, fetcher) => {
    try {
      const data = await fetcher();
      const filePath = path.join(OUTPUT_DIR, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ ${name}: ${data.length} baris`);
      return data.length;
    } catch (e) {
      console.error(`❌ Gagal export ${name}:`, e.message);
      return 0;
    }
  };

  // Export dalam urutan yang aman (tanpa FK dulu)
  await exportTable('User', () => prisma.user.findMany());
  await exportTable('PushSubscription', () => prisma.pushSubscription.findMany());
  await exportTable('Attendance', () => prisma.attendance.findMany());
  await exportTable('Payroll', () => prisma.payroll.findMany());
  await exportTable('Calendar', () => prisma.calendar.findMany());
  await exportTable('Announcement', () => prisma.announcement.findMany());
  await exportTable('PasswordReset', () => prisma.passwordReset.findMany());
  await exportTable('Message', () => prisma.message.findMany());
  await exportTable('SystemSetting', () => prisma.systemSetting.findMany());

  console.log(`\n📁 Data tersimpan di: ${OUTPUT_DIR}`);
  console.log('✅ Export selesai! Lanjutkan ke Step 2 (update schema + .env)\n');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

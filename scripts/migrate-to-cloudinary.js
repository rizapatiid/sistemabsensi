require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

const prisma = new PrismaClient();

// Konfigurasi Cloudinary dari .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(base64Str, folderName) {
  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder: folderName,
    });
    return result.secure_url;
  } catch (error) {
    console.error('❌ Gagal upload ke Cloudinary:', error.message);
    return null;
  }
}

async function migrateTable(tableName, folderName, imageFields) {
  console.log(`\n🔄 Mulai migrasi tabel: ${tableName}...`);
  
  // Ambil data yang mengandung base64
  const records = await prisma[tableName].findMany();
  let updatedCount = 0;

  for (const record of records) {
    let hasUpdates = false;
    const updateData = {};

    for (const field of imageFields) {
      const fieldValue = record[field];
      
      // Jika field berisi base64
      if (fieldValue && fieldValue.startsWith('data:image')) {
        console.log(`  ➤ Mengupload gambar ${field} untuk ID: ${record.id || record.tanggal}`);
        const url = await uploadToCloudinary(fieldValue, folderName);
        
        if (url) {
          updateData[field] = url;
          hasUpdates = true;
        }
      }
    }

    if (hasUpdates) {
      // Update record di database
      await prisma[tableName].update({
        where: record.id ? { id: record.id } : { tanggal: record.tanggal },
        data: updateData
      });
      updatedCount++;
      console.log(`  ✅ Berhasil update ${tableName} ID: ${record.id || record.tanggal}`);
    }
  }

  console.log(`🎉 Selesai migrasi ${tableName}. Total diupdate: ${updatedCount}`);
}

async function main() {
  console.log('🚀 MEMULAI MIGRASI GAMBAR KE CLOUDINARY...\n');

  try {
    // Migrasi Announcement (field: image)
    await migrateTable('announcement', 'pengumuman', ['image']);

    // Migrasi Calendar (field: image)
    await migrateTable('calendar', 'kalender', ['image']);

    // Migrasi Attendance (field: foto, buktiApp)
    await migrateTable('attendance', 'absensi', ['foto', 'buktiApp']);

    console.log('\n✅ SEMUA MIGRASI SELESAI!');
  } catch (error) {
    console.error('\n❌ Terjadi kesalahan fatal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

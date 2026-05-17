/**
 * RMP Digitals WhatsApp API Integration
 * Menggunakan Fonnte (https://fonnte.com) sebagai provider pihak ketiga
 */

export async function sendWhatsAppMessage(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    console.warn("⚠️ FONNTE_TOKEN belum diatur di .env. Pesan WhatsApp tidak dikirim.");
    console.log(`[MOCK WA to ${target}]:\n${message}`);
    return { success: false, error: "Token Fonnte tidak ditemukan" };
  }

  // Bersihkan format nomor (ubah 08 menjadi 628 jika perlu)
  let cleanNumber = target.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.substring(1);
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": token,
      },
      body: new URLSearchParams({
        target: cleanNumber,
        message: message,
        typing: "false",
        delay: "2"
      })
    });

    const result = await response.json();
    
    if (result.status) {
      console.log(`✅ Berhasil mengirim WhatsApp ke ${cleanNumber}`);
      return { success: true, response: result };
    } else {
      console.error(`❌ Gagal mengirim WhatsApp: ${result.reason}`);
      return { success: false, error: result.reason };
    }
  } catch (error) {
    console.error(`❌ Error sistem saat mengirim WhatsApp:`, error);
    return { success: false, error: "Terjadi kesalahan jaringan" };
  }
}

// Format mata uang rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka)
}

/**
 * Helper: Broadcast pesan ke semua karyawan aktif yang memiliki nomor HP
 */
export async function broadcastWhatsApp(message: string) {
  // Hanya eksekusi jika token tersedia untuk menghemat query DB
  if (!process.env.FONNTE_TOKEN) {
    console.log(`[MOCK BROADCAST WA]:\n${message}`);
    return;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const employees = await prisma.user.findMany({
      where: {
        role: 'KARYAWAN',
        status: 'AKTIF',
        phone: { not: null }
      },
      select: { phone: true, nama: true }
    });

    console.log(`📢 Memulai Broadcast WA ke ${employees.length} karyawan...`);
    
    // Kirim secara asinkron tanpa memblokir thread utama
    employees.forEach((emp) => {
      if (emp.phone) {
        const personalizedMessage = `Halo *${emp.nama}*,\n\n${message}`;
        sendWhatsAppMessage(emp.phone, personalizedMessage);
      }
    });

  } catch (e) {
    console.error("Gagal melakukan broadcast WA:", e);
  }
}

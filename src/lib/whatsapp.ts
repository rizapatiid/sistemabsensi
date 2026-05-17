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

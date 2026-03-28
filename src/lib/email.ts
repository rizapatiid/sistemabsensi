import nodemailer from "nodemailer"

/**
 * World-Class Email Notification System for RMP Digitals
 * Optimized for secure, prestigous personnel communication on ALL devices.
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Currency Formatter for prestigous look
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount)
}

function getMonthName(monthNumber: number) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  return months[monthNumber - 1]
}

// Master Wrapper for All Emails (Mobile Optimized)
const emailBaseTemplate = (title: string, subtitle: string, content: string, footer: string, logoUrl = "https://www.rmp.my.id/logositus.png") => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
      body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .header { padding: 40px 20px; text-align: center; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; }
      .content { padding: 40px 30px; }
      .footer { padding: 30px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
      .btn { display: inline-block; padding: 16px 32px; background-color: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; margin-top: 20px; transition: all 0.3s ease; text-align: center; }
      .badge { display: inline-block; padding: 6px 14px; border-radius: 30px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; }
      .data-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; margin: 25px 0; }
      .data-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
      .data-label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
      .data-value { color: #0f172a; font-size: 14px; font-weight: 700; text-align: right; }
      @media (max-width: 480px) {
        .container { margin: 0; border-radius: 0; }
        .content { padding: 30px 20px; }
        .btn { width: 100%; box-sizing: border-box; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="RMP Digitals" width="70" style="margin-bottom: 15px; display: inline-block;">
        <h2 style="margin: 0; color: #1e3a8a; font-size: 16px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">RMP DIGITALS</h2>
        <p style="margin: 5px 0 0; color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Sistem Manajemen Personil & Keuangan</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0; color: #94a3b8; font-size: 11px; line-height: 1.6; font-weight: 500;">
          ${footer}<br/>
          &copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS
        </p>
      </div>
    </div>
  </body>
  </html>
`

/**
 * 1. NOTIFIKASI PAYROLL TERBIT
 */
export async function sendPayrollNotificationEmail(toEmail: string, employeeName: string, month: number, year: number, totalGaji: number) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const content = `
    <div class="badge" style="background-color: #e0e7ff; color: #3730a3;">Slip Gaji Baru Tersedia</div>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 20px; line-height: 1.2;">Halo, ${employeeName.toUpperCase()}! 👋</h1>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">Slip gaji Anda untuk periode <strong>${monthName} ${year}</strong> telah diterbitkan oleh sistem. Segera tinjau rincian gaji Anda melalui Portal RMP.</p>
    
    <div style="background-color: #1e3a8a; border-radius: 16px; padding: 25px; margin-top: 30px; text-align: center; color: #ffffff;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; opacity: 0.8; margin-bottom: 5px;">Estimasi Gaji Bersih</div>
      <div style="font-size: 28px; font-weight: 900; letter-spacing: -0.02em;">${formattedGaji}</div>
    </div>
    
    <div style="text-align: center; margin-top: 10px;">
      <a href="https://www.rmp.my.id/" class="btn">LIHAT SLIP GAJI SAYA</a>
    </div>
  `
  const footer = "Email ini dikirim secara otomatis. Mohon jangan membalas email ini."
  
  try {
    await transporter.sendMail({ from: `"RMP Digitals Payroll" <${process.env.EMAIL_FROM}>`, to: toEmail, subject: `[SLIP GAJI] - ${monthName} ${year}`, html: emailBaseTemplate("Slip Gaji Digital", "", content, footer) })
    return { success: true }
  } catch (err) { return { error: "Gagal kirim email" } }
}

/**
 * 2. NOTIFIKASI PEMBAYARAN BERHASIL (DIBAYAR)
 */
export async function sendPaymentConfirmationEmail(toEmail: string, employeeName: string, month: number, year: number, totalGaji: number, bankName: string, accNo: string, accName: string) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const content = `
    <div class="badge" style="background-color: #dcfce7; color: #166534;">Pembayaran Berhasil</div>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 20px; line-height: 1.2;">Kabar Gembira! 💸</h1>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">Gaji Anda periode <strong>${monthName} ${year}</strong> telah berhasil ditransfer ke rekening terdaftar.</p>
    
    <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 25px; margin-top: 30px; text-align: center;">
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Dana Ditransfer</div>
      <div style="font-size: 28px; font-weight: 900; color: #166534;">${formattedGaji}</div>
    </div>

    <table class="data-table">
      <tr><td class="data-label">INSTITUSI BANK</td><td class="data-value">${bankName}</td></tr>
      <tr><td class="data-label">NOMOR REKENING</td><td class="data-value">${accNo}</td></tr>
      <tr><td class="data-label">NAMA PENERIMA</td><td class="data-value">${accName}</td></tr>
    </table>
    
    <div style="text-align: center;">
      <a href="https://www.rmp.my.id/employee/transaksi" class="btn">LIHAT DETAIL TRANSFER</a>
    </div>
  `
  const footer = "Synergy & Technology for Excellence. Hubungi Finance jika dana belum masuk."

  try {
    await transporter.sendMail({ from: `"RMP Finance" <${process.env.EMAIL_FROM}>`, to: toEmail, subject: `[DIBAYAR] - Gaji ${monthName} ${year} Sukses`, html: emailBaseTemplate("Konfirmasi Pembayaran", "", content, footer) })
    return { success: true }
  } catch (err) { return { error: "Gagal kirim email" } }
}

/**
 * 3. NOTIFIKASI KEAMANAN LOGIN
 */
export async function sendLoginNotificationEmail(toEmail: string, employeeName: string, ip: string, userAgent: string) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }
  const now = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date())

  const content = `
    <div class="badge" style="background-color: #fff7ed; color: #9a3412;">Aktivitas Login Baru</div>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 20px; line-height: 1.2;">Security Alert 🚨</h1>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;">Sistem mendeteksi aktivitas login baru ke akun Anda. Jika ini adalah Anda, silakan abaikan notifikasi keamanan ini.</p>
    
    <table class="data-table">
      <tr><td class="data-label">WAKTU (WIB)</td><td class="data-value">${now}</td></tr>
      <tr><td class="data-label">ALAMAT IP</td><td class="data-value" style="color: #1e3a8a;">${ip || "Unknown"}</td></tr>
      <tr><td class="data-label">PERANGKAT</td><td class="data-value" style="font-size: 12px;">${userAgent || "Unknown"}</td></tr>
    </table>

    <div style="background-color: #7f1d1d; border-radius: 12px; padding: 15px; color: #ffffff; font-size: 12px; line-height: 1.5; font-weight: 600;">
       Jika merasa tidak login, segera amankan akun Anda melalui Administrator IT RMP.
    </div>
    
    <div style="text-align: center; margin-top: 10px;">
      <a href="https://www.rmp.my.id/" class="btn">INI SAYA, AMANKAN</a>
    </div>
  `
  const footer = "Protocol Keamanan Digital RMP. Dikirim untuk melindungi identitas Anda."

  try {
    await transporter.sendMail({ from: `"RMP Security" <${process.env.EMAIL_FROM}>`, to: toEmail, subject: `❗ Notifikasi Login RMP Digitals`, html: emailBaseTemplate("Keamanan Login", "", content, footer) })
    return { success: true }
  } catch (err) { return { error: "Gagal kirim email" } }
}

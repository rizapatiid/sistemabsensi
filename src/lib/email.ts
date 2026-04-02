import nodemailer from "nodemailer"

/**
 * World-Class Luxury Email System for RMP Digitals
 * Optimized for Prestigous Brand Consistency & Operational Speed in Bahasa Indonesia.
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Secure 'From' Address Fail-Safe
const emailFrom = `"RMP Digitals Official" <${process.env.EMAIL_SERVER_USER}>`

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount)
}

function getMonthName(monthNumber: number) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  return months[monthNumber - 1]
}

// Master Layout (Responsive & High-End Typography)
const emailMasterLayout = (badge: string, color: string, title: string, content: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
      body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', -apple-system, sans-serif; }
      .main { width: 100%; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
      .header { padding: 50px 40px; text-align: center; background: #f8fafc; border-bottom: 2px solid #f1f5f9; }
      .body { padding: 50px 45px; }
      .badge { display: inline-block; padding: 7px 16px; border-radius: 50px; background: ${color}20; color: ${color}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 25px; }
      .title { color: #0f172a; font-size: 28px; font-weight: 850; line-height: 1.2; margin: 0 0 20px; letter-spacing: -0.01em; }
      .text { color: #475569; font-size: 16px; line-height: 1.7; margin-bottom: 35px; }
      .btn { display: inline-block; padding: 20px 45px; background: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -5px rgba(30,58,138,0.3); text-align: center; }
      .footer { padding: 40px; text-align: center; background: #f8fafc; font-size: 11px; color: #94a3b8; line-height: 1.8; border-top: 1px solid #f1f5f9; }
      .divider { width: 60px; height: 4px; background: #1e3a8a; border-radius: 10px; margin-bottom: 30px; }
      .detail-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 35px; }
      @media(max-width: 480px) { .main { margin: 0; border-radius: 0; } .body { padding: 40px 25px; } .btn { width: 100%; box-sizing: border-box; } }
    </style>
  </head>
  <body>
    <div class="main">
      <div class="header">
        <img src="https://www.rmp.my.id/logositus.png" alt="RMP" width="75">
        <p style="margin: 15px 0 0; color: #1e3a8a; font-size: 14px; font-weight: 850; letter-spacing: 0.3em; text-transform: uppercase;">RMP DIGITALS</p>
      </div>
      <div class="body">
        <span class="badge">${badge}</span>
        <div class="divider"></div>
        <h1 class="title">${title}</h1>
        <div class="text">${content}</div>
        <div style="text-align: center;"><a href="https://www.rmp.my.id/" class="btn">MASUK KE DASHBOARD</a></div>
      </div>
      <div class="footer">
        <strong>RMP DIGITALS</strong><br/>
        SINERGI & TEKNOLOGI UNTUK EXCELLENCE<br/>
        &copy; ${new Date().getFullYear()} Hak Cipta Dilindungi
      </div>
    </div>
  </body>
  </html>
`

/**
 * 1. NOTIFIKASI PAYROLL TERBIT (BAHASA INDONESIA)
 */
export async function sendPayrollNotificationEmail(toEmail: string, employeeName: string, month: number, year: number, totalGaji: number) {
  if (!toEmail) return { error: "Target email not found" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const content = `
    Halo <strong>${employeeName.toUpperCase()}</strong>,<br/><br/>
    Laporan slip gaji digital Anda untuk periode <strong>${monthName} ${year}</strong> telah berhasil diterbitkan oleh sistem kami. RMP berkomitmen pada keterbukaan dan rekognisi atas setiap kontribusi Anda.
    
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); margin: 40px 0; border-radius: 20px; padding: 40px; text-align: center; color: #ffffff;">
      <span style="font-size: 0.75rem; font-weight: 850; text-transform: uppercase; opacity: 0.7; letter-spacing: 0.15em;">Nominal Gaji Bersih</span>
      <h2 style="font-size: 2.25rem; font-weight: 950; margin: 10px 0 0; letter-spacing: -0.02em;">${formattedGaji}</h2>
    </div>
    Silakan masuk ke portal karyawan untuk meninjau rincian upah, tunjangan, dan status absensi Anda secara lengkap.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `[PAYROLL] - Slip Gaji Digital ${monthName} ${year} (${employeeName})`, html: emailMasterLayout("Slip Gaji Terbit", "#1e3a8a", "Gaji Digital Anda Sudah Tersedia.", content) })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Network anomaly during transmission" } }
}

/**
 * 2. NOTIFIKASI PEMBAYARAN BERHASIL (BAHASA INDONESIA + DETAIL REKENING)
 */
export async function sendPaymentConfirmationEmail(toEmail: string, employeeName: string, month: number, year: number, totalGaji: number, bankName: string, accNo: string, accName: string) {
  if (!toEmail) return { error: "Target email not found" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const content = `
    Selamat <strong>${employeeName.toUpperCase()}</strong>!<br/><br/>
    Kami informasikan bahwa dana gaji Anda untuk periode periode <strong>${monthName} ${year}</strong> telah berhasil ditransfer ke rekening perbankan terdaftar.
    
    <div class="detail-card">
       <h3 style="color: #1e3a8a; font-size: 13px; font-weight: 850; text-transform: uppercase; margin: 0 0 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Rincian Transaksi</h3>
       <table style="width: 100%; font-size: 14px;">
         <tr><td style="color: #94a3b8; padding: 6px 0;">INSTITUSI BANK</td><td style="text-align: right; font-weight: 750;">${bankName || "-"}</td></tr>
         <tr><td style="color: #94a3b8; padding: 6px 0;">NOMOR REKENING</td><td style="text-align: right; font-weight: 750;">${accNo || "-"}</td></tr>
         <tr><td style="color: #94a3b8; padding: 6px 0;">ATAS NAMA</td><td style="text-align: right; font-weight: 750;">${accName || "-"}</td></tr>
         <tr><td style="color: #166534; padding: 10px 0; font-weight: 850;">TOTAL DITERIMA</td><td style="text-align: right; font-weight: 850; color: #15803d; font-size: 18px;">${formattedGaji}</td></tr>
       </table>
    </div>
    Silakan cek saldo bank Anda. Semoga bermanfaat bagi Anda dan keluarga.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `[DIBAYAR] - Konfirmasi Pembayaran Gaji ${monthName} ${year}`, html: emailMasterLayout("Pembayaran Berhasil", "#10b981", "Dana Anda Telah Terkirim.", content) })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Network anomaly during transmission" } }
}

/**
 * 3. NOTIFIKASI KEAMANAN LOGIN (BAHASA INDONESIA)
 */
export async function sendLoginNotificationEmail(toEmail: string, employeeName: string, ip: string, userAgent: string) {
  if (!toEmail) return { error: "Target email not found" }
  const now = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date())

  const content = `
    Sistem mendeteksi aktivitas login baru pada akun RMP Anda demi menjaga keamanan data pribadi oleh <strong>${employeeName.toUpperCase()}</strong>.<br/><br/>
    <div class="detail-card">
       <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
         <tr><td style="color: #94a3b8; padding: 8px 0; text-transform: uppercase; font-size: 11px; font-weight: 600;">Waktu Login</td><td style="text-align: right; font-weight: 750; color: #1e3a8a;">${now}</td></tr>
         <tr><td style="color: #94a3b8; padding: 8px 0; text-transform: uppercase; font-size: 11px; font-weight: 600;">Lokasi IP</td><td style="text-align: right; font-weight: 750; color: #1e3a8a;">${ip}</td></tr>
         <tr><td style="color: #94a3b8; padding: 8px 0; text-transform: uppercase; font-size: 11px; font-weight: 600;">Detail Perangkat</td><td style="text-align: right; font-weight: 500; font-size: 12px; color: #475569;">${userAgent}</td></tr>
       </table>
    </div>
    Jika Anda merasa tidak melakukan aktivitas ini, mohon segera amankan akses portal Anda sekarang.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `❗ Keamanan: Login RMP Digitals Terdeteksi`, html: emailMasterLayout("Keamanan Akun", "#f97316", "Laporan Aktivitas Login Anda.", content) })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Network anomaly during transmission" } }
}
/**
 * 4. NOTIFIKASI RESET PASSWORD (OTP)
 */
export async function sendResetPasswordEmail(toEmail: string, employeeName: string, otp: string) {
  if (!toEmail) return { error: "Target email not found" }

  const content = `
    Halo <strong>${employeeName.toUpperCase()}</strong>,<br/><br/>
    Anda telah meminta untuk mengatur ulang kata sandi akun RMP Digitals Anda. Gunakan kode verifikasi di bawah ini untuk melanjutkan proses:
    
    <div style="background: #f8fafc; border: 2px dashed #1e3a8a; margin: 30px 0; border-radius: 16px; padding: 30px; text-align: center;">
      <span style="font-size: 0.75rem; font-weight: 850; text-transform: uppercase; color: #64748b; letter-spacing: 0.15em; display: block; margin-bottom: 10px;">Kode OTP Anda</span>
      <h2 style="font-size: 1.8rem; font-weight: 950; margin: 0; color: #1e3a8a; letter-spacing: 0.2em;">${otp}</h2>
    </div>
    
    Kode ini hanya berlaku selama <strong>10 menit</strong>. Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini atau hubungi tim IT kami segera.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `[OTP] - Kode Pengaturan Ulang Kata Sandi RMP`, html: emailMasterLayout("Reset Password", "#1e3a8a", "Permintaan Atur Ulang Sandi.", content) })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Gagal mengirim email OTP" } }
}

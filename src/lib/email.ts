import nodemailer from "nodemailer"

/**
 * World-Class Luxury Email System for RMP Digitals
 * Optimized for Prestigous Brand Consistency & Operational Speed.
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
const emailMasterLayout = (badge: string, color: string, title: string, content: string, footer: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
      body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }
      .main { width: 100%; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
      .header { padding: 50px 40px; text-align: center; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
      .body { padding: 50px 45px; }
      .badge { display: inline-block; padding: 7px 16px; border-radius: 50px; background: ${color}20; color: ${color}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 25px; }
      .title { color: #0f172a; font-size: 28px; font-weight: 850; line-height: 1.2; margin: 0 0 20px; letter-spacing: -0.01em; }
      .text { color: #475569; font-size: 16px; line-height: 1.7; margin-bottom: 35px; }
      .btn { display: inline-block; padding: 20px 45px; background: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 15px -5px rgba(30,58,138,0.3); }
      .footer { padding: 40px; text-align: center; background: #f8fafc; font-size: 11px; color: #94a3b8; line-height: 1.8; border-top: 1px solid #f1f5f9; }
      .divider { width: 60px; height: 4px; background: #1e3a8a; border-radius: 10px; margin-bottom: 30px; }
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
        <div style="text-align: center;"><a href="https://www.rmp.my.id/" class="btn">AKSES PORTAL PERSONIL</a></div>
      </div>
      <div class="footer">
        <strong>PT RIZA MEDIA PRODUCTIONS</strong><br/>
        SYNERGY & TECHNOLOGY FOR EXCELLENCE<br/>
        &copy; ${new Date().getFullYear()} Automated Security System
      </div>
    </div>
  </body>
  </html>
`

/**
 * 1. NOTIFIKASI PAYROLL TERBIT
 */
export async function sendPayrollNotificationEmail(toEmail: string, employeeName: string, month: number, year: number, totalGaji: number) {
  if (!toEmail) return { error: "Target email not found" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const content = `
    Halo <strong>${employeeName.toUpperCase()}</strong>,<br/><br/>
    Laporan kesejahteraan Anda untuk periode <strong>${monthName} ${year}</strong> telah diterbitkan secara resmi melalui sistem. RMP berkomitmen pada keterbukaan dan rekognisi atas dedikasi Anda.
    
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); margin: 40px 0; border-radius: 20px; padding: 40px; text-align: center; color: #ffffff;">
      <span style="font-size: 0.75rem; font-weight: 850; text-transform: uppercase; opacity: 0.7; letter-spacing: 0.15em;">Nominal Gaji Bersih</span>
      <h2 style="font-size: 2.25rem; font-weight: 950; margin: 10px 0 0; letter-spacing: -0.02em;">${formattedGaji}</h2>
    </div>
    Silakan kunjungi dashboard untuk rincian upah lengkap Anda.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `[PAYROLL] - Slip Gaji Digital ${monthName} ${year}`, html: emailMasterLayout("Payroll Released", "#1e3a8a", "Slip Gaji digital Anda sudah tersedia.", content, "Privacy Policy: RMP Personnel Confidentiality.") })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Network anomaly during transmission" } }
}

/**
 * 2. NOTIFIKASI PEMBAYARAN BERHASIL (DIBAYAR)
 */
export async function sendPaymentConfirmationEmail(toEmail: string, employeeName: string, month: number, year: number, totalGaji: number, bankName: string, accNo: string, accName: string) {
  if (!toEmail) return { error: "Target email not found" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const content = `
    Selamat, <strong>${employeeName.toUpperCase()}</strong>!<br/><br/>
    Hak atas periode <strong>${monthName} ${year}</strong> telah dipindahkan ke instansi perbankan pribadi Anda secara tuntas.
    
    <div style="border: 2px solid #10b981; border-radius: 24px; padding: 35px; margin: 40px 0; text-align: center; background: #f0fdf4;">
       <h2 style="font-size: 2.5rem; font-weight: 950; color: #15803d; margin: 0;">${formattedGaji}</h2>
       <p style="color: #166534; font-size: 0.8rem; font-weight: 850; margin: 15px 0 0; text-transform: uppercase; letter-spacing: 0.05em;">LUNAS PADA ${bankName} (${accNo})</p>
    </div>
    Semoga bermanfaat dan terus semangat berkarya bersama RMP Digitals.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `[DIBAYAR] - Dana Kelebihan Hak ${monthName} ${year}`, html: emailMasterLayout("Payment Successful", "#10b981", "Konfirmasi pencairan dana Anda.", content, "Finance: Trusted Financial Disbursement.") })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Network anomaly during transmission" } }
}

/**
 * 3. NOTIFIKASI KEAMANAN LOGIN
 */
export async function sendLoginNotificationEmail(toEmail: string, employeeName: string, ip: string, userAgent: string) {
  if (!toEmail) return { error: "Target email not found" }
  const now = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date())

  const content = `
    Kami mendeteksi aktivitas login baru pada akun RMP Anda oleh <strong>${employeeName.toUpperCase()}</strong>.<br/><br/>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
       <table style="width: 100%; border-collapse: collapse;">
         <tr><td style="color: #94a3b8; font-size: 11px; font-weight: 600; padding: 5px 0; text-transform: uppercase;">Waktu</td><td style="text-align: right; font-weight: 750; color: #1e3a8a;">${now}</td></tr>
         <tr><td style="color: #94a3b8; font-size: 11px; font-weight: 600; padding: 5px 0; text-transform: uppercase;">Lokasi IP</td><td style="text-align: right; font-weight: 750; color: #1e3a8a;">${ip}</td></tr>
       </table>
    </div>
    Jika login ini tidak sah, harap segera ubah kredensial Anda sekarang.
  `

  try {
    await transporter.sendMail({ from: emailFrom, to: toEmail, subject: `❗ Security: Deteksi Login RMP Digitals`, html: emailMasterLayout("Security Alert", "#f97316", "Laporan aktivitas akses akun pening.", content, "Guard: Industrial Strength Security Protocol.") })
    return { success: true }
  } catch (err) { console.error("SMTP Error:", err); return { error: "Network anomaly during transmission" } }
}

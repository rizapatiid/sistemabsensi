import nodemailer from "nodemailer"

/**
 * World-Class Clean Email System for RMP Digitals
 * Optimized for Instant Delivery & Mobile-First Excellence.
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Currency Formatter
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

// Master Wrapper for All Emails (Standardized)
const emailBaseTemplate = (title: string, badge: string, badgeColor: string, content: string, logoUrl = "https://www.rmp.my.id/logositus.png") => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
      body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', sans-serif; }
      .container { max-width: 550px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1); }
      .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; }
      .badge { display: inline-block; padding: 6px 14px; border-radius: 30px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; color: #ffffff; background-color: ${badgeColor}; }
      .content { padding: 40px 35px; }
      .btn { display: inline-block; padding: 18px 40px; background-color: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 15px; margin-top: 30px; transition: 0.3s; }
      @media (max-width: 480px) { .container { margin: 0; border-radius: 0; } .content { padding: 30px 20px; } .btn { width: 100%; box-sizing: border-box; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="RMP" width="60" style="margin-bottom: 15px;">
        <h2 style="margin: 0; color: #1e3a8a; font-size: 14px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;">RMP DIGITALS</h2>
      </div>
      <div class="content">
        <div class="badge">${badge}</div>
        <h1 style="color: #0f172a; font-size: 26px; font-weight: 850; margin: 0 0 25px; line-height: 1.1;">${title}</h1>
        <div style="color: #475569; font-size: 16px; line-height: 1.6;">${content}</div>
        <div style="text-align: center;"><a href="https://www.rmp.my.id/" class="btn">BUKA DASHBOARD RMP</a></div>
      </div>
      <div style="padding: 30px; text-align: center; background-color: #f8fafc; font-size: 10px; color: #94a3b8; font-weight: 600; letter-spacing: 0.05em;">
        DITERBITKAN SECARA OTOMATIS OLEH PT RIZA MEDIA PRODUCTIONS &copy; ${new Date().getFullYear()}
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
    Halo, <strong>${employeeName.toUpperCase()}</strong>!<br/><br/>
    Laporan gaji Anda untuk periode <strong>${monthName} ${year}</strong> telah tersedia secara digital. RMP percaya pada transparansi dan kesejahteraan bagi setiap personil kami.
    
    <div style="background-color: #1e3a8a; padding: 25px; border-radius: 16px; margin-top: 25px; text-align: center; color: white;">
      <div style="font-size: 11px; opacity: 0.8; font-weight: 700; text-transform: uppercase;">Total Gaji Bersih</div>
      <div style="font-size: 30px; font-weight: 900;">${formattedGaji}</div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"RMP Digitals Payroll" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `[SLIP GAJI] - ${monthName} ${year}`,
      html: emailBaseTemplate("Slip Gaji Digital", "Paycheck Notification", "#1e3a8a", content)
    })
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
    Kabar gembira, <strong>${employeeName.toUpperCase()}</strong>!<br/><br/>
    Hak Anda untuk periode <strong>${monthName} ${year}</strong> telah berhasil ditransfer ke rekening terdaftar. Silakan cek saldo perbankan Anda hari ini.
    
    <div style="background-color: #f1fef5; border: 2px dashed #10b981; padding: 25px; border-radius: 16px; margin-top: 25px; text-align: center;">
       <div style="font-size: 28px; font-weight: 900; color: #15803d;">${formattedGaji}</div>
       <div style="font-size: 11px; color: #166534; font-weight: 800; margin-top: 8px;">DITERIMA PADA REKENING ${bankName} (${accNo})</div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"RMP Finance" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `[DIBAYAR] - Gaji ${monthName} ${year} Selesai`,
      html: emailBaseTemplate("Dana Telah Terkirim", "Finance Confirmation", "#10b981", content)
    })
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
    Keamanan adalah prioritas utama RMP. Kami mendeteksi aktivitas login baru pada akun <strong>${employeeName.toUpperCase()}</strong>.<br/><br/>
    <strong>Waktu:</strong> ${now}<br/>
    <strong>IP:</strong> ${ip}<br/>
    <strong>Device:</strong> ${userAgent}<br/><br/>
    <div style="background-color: #fff7ed; padding: 15px; border-radius: 12px; color: #9a3412; font-size: 13px; font-weight: 600;">Jika ini bukan Anda, hubungi Admin segera.</div>
  `

  try {
    await transporter.sendMail({
      from: `"RMP Security" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `❗ Akses Login RMP Digitals Deteksi`,
      html: emailBaseTemplate("Security Warning", "Access Guard", "#f97316", content)
    })
    return { success: true }
  } catch (err) { return { error: "Gagal kirim email" } }
}

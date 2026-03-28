import nodemailer from "nodemailer"

/**
 * World-Class Email Notification System for RMP Digitals
 * Optimized for secure, prestigous personnel communication.
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

/**
 * NOTIFIKASI PAYROLL TERBIT
 */
export async function sendPayrollNotificationEmail(
  toEmail: string,
  employeeName: string,
  month: number,
  year: number,
  totalGaji: number
) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }

  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)
  const dashboardLink = "https://www.rmp.my.id/"
  const logoUrl = "https://www.rmp.my.id/logositus.png"

  const mailOptions = {
    from: `"RMP Digitals Payroll" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: `[SLIP GAJI] - Periode ${monthName} ${year}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #f8fafc; padding: 40px 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <img src="${logoUrl}" alt="RMP Digitals" style="height: 80px; width: auto; margin-bottom: 16px;">
          <h1 style="color: #1e3a8a; margin: 0; font-size: 1.4rem; letter-spacing: 0.1em; font-weight: 850;">RMP DIGITALS</h1>
          <p style="color: #64748b; margin: 5px 0 0 0; font-size: 0.75rem; font-weight: 650; text-transform: uppercase; letter-spacing: 0.05em;">Laporan Penghidupan Personil</p>
        </div>
        <div style="padding: 48px 40px;">
          <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 32px; line-height: 1.6;">
            Halo <strong>${employeeName.toUpperCase()}</strong>,<br/>
            Laporan payroll Anda untuk periode <strong>${monthName} ${year}</strong> telah berhasil difinalisasi dan diterbitkan.
          </p>
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 16px; padding: 32px; margin-bottom: 40px; text-align: center;">
            <div style="color: rgba(255,255,255,0.8); font-size: 0.7rem; font-weight: 850; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em;">Total Gaji Diterbitkan</div>
            <div style="color: #ffffff; font-size: 2rem; font-weight: 950; letter-spacing: -0.02em;">${formattedGaji}</div>
          </div>
          <div style="text-align: center;">
            <a href="${dashboardLink}" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; padding: 18px 36px; border-radius: 14px; font-weight: 850; text-decoration: none; font-size: 0.9rem;">BUKA DASHBOARD PERSONIL</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 0.65rem; color: #94a3b8; margin: 0; font-weight: 650; line-height: 1.8; text-transform: uppercase;">&copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Email Error:", error)
    return { error: "Gagal mengirim notifikasi email" }
  }
}

/**
 * NOTIFIKASI PEMBAYARAN BERHASIL (DIBAYAR)
 */
export async function sendPaymentConfirmationEmail(
  toEmail: string,
  employeeName: string,
  month: number,
  year: number,
  totalGaji: number,
  bankName: string,
  accNo: string,
  accName: string
) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }

  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)
  const logoUrl = "https://www.rmp.my.id/logositus.png"

  const mailOptions = {
    from: `"RMP Digitals Finance" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: `[PEMBAYARAN SUCCESS] - Payroll Periode ${monthName} ${year}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #059669; padding: 40px 32px; text-align: center;">
          <img src="${logoUrl}" alt="RMP Digitals" style="height: 60px; width: auto; margin-bottom: 20px; filter: brightness(0) invert(1);">
          <h1 style="color: #ffffff; margin: 0; font-size: 1.75rem; font-weight: 950;">DANA TELAH DIKIRIM</h1>
        </div>
        <div style="padding: 48px 40px;">
          <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 32px; line-height: 1.6;">
            Halo <strong>${employeeName.toUpperCase()}</strong>,<br/>
            Gaji Anda periode <strong>${monthName} ${year}</strong> telah berhasil ditransfer.
          </p>
          <div style="background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 16px; padding: 32px; margin-bottom: 40px; text-align: center;">
            <div style="color: #059669; font-size: 0.75rem; font-weight: 850; text-transform: uppercase; margin-bottom: 8px;">Jumlah Ditransfer</div>
            <div style="color: #064e3b; font-size: 2.25rem; font-weight: 950;">${formattedGaji}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
            <table style="width: 100%;">
              <tr><td style="color: #94a3b8; font-size: 0.75rem;">BANK</td><td style="text-align: right; font-weight: 750;">${bankName}</td></tr>
              <tr><td style="color: #94a3b8; font-size: 0.75rem;">REKENING</td><td style="text-align: right; font-weight: 750;">${accNo}</td></tr>
              <tr><td style="color: #94a3b8; font-size: 0.75rem;">NAMA</td><td style="text-align: right; font-weight: 750;">${accName}</td></tr>
            </table>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 0.6rem; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Payment Confirmation Email Error:", error)
    return { error: "Gagal mengirim email konfirmasi pembayaran" }
  }
}

/**
 * NOTIFIKASI KEAMANAN LOGIN
 */
export async function sendLoginNotificationEmail(
  toEmail: string,
  employeeName: string,
  ip: string,
  userAgent: string
) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }

  const now = new Date()
  const timeWIB = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta"
  }).format(now)
  const logoUrl = "https://www.rmp.my.id/logositus.png"

  const mailOptions = {
    from: `"RMP Digitals Security" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: `❗ [KEAMANAN] - Login Berhasil ke Akun Anda`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1e293b; padding: 40px 32px; text-align: center;">
          <img src="${logoUrl}" alt="RMP Security" style="height: 50px; width: auto; margin-bottom: 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 1.5rem; font-weight: 850;">PEMBERITAHUAN LOGIN</h1>
        </div>
        <div style="padding: 48px 40px;">
          <p style="font-size: 0.95rem; color: #475569; margin-bottom: 24px;">
            Halo <strong>${employeeName.toUpperCase()}</strong>, sistem mendeteksi aktivitas login baru pada:
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <table style="width: 100%;">
              <tr><td style="color: #94a3b8; font-size: 0.75rem;">WAKTU (WIB)</td><td style="text-align: right; font-weight: 750;">${timeWIB}</td></tr>
              <tr><td style="color: #94a3b8; font-size: 0.75rem;">ALAMAT IP</td><td style="text-align: right; font-weight: 850; color: #1e40af;">${ip || "Unknown"}</td></tr>
              <tr><td style="color: #94a3b8; font-size: 0.75rem;">PERANGKAT</td><td style="text-align: right; font-size: 0.75rem;">${userAgent || "Unknown"}</td></tr>
            </table>
          </div>
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; font-size: 0.8rem; color: #92400e;">
            Jika ini bukan Anda, segera hubungi Admin IT RMP untuk mengamankan akun.
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center;">
          <p style="font-size: 0.6rem; color: #94a3b8; margin: 0;">PT RIZA MEDIA PRODUCTIONS - SECURITY PROTOCOL</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Login Notification Error:", error)
    return { error: "Gagal mengirim notifikasi login" }
  }
}

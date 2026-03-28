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

  const mailOptions = {
    from: `"RMP Digitals Payroll" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: `[NOTIFIKASI PAYROLL] - Periode ${monthName} ${year}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 1.5rem; letter-spacing: 0.1em; font-weight: 800;">RMP DIGITALS</h1>
          <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 0.8rem; font-weight: 600;">PORTAL MANAJEMEN PERSONIL</p>
        </div>
        
        <div style="padding: 40px 32px; background-color: #ffffff;">
          <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px;">Halo, ${employeeName.toUpperCase()}</h2>
          <p style="font-size: 0.95rem; line-height: 1.6; color: #475569; margin-bottom: 32px;">
            Laporan payroll Anda untuk periode <strong>${monthName} ${year}</strong> telah berhasil diterbitkan oleh administrator sistem.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <div style="color: #64748b; font-size: 0.75rem; font-weight: 850; text-transform: uppercase; margin-bottom: 8px;">Total Gaji Diterbitkan</div>
            <div style="color: #1e3a8a; font-size: 1.75rem; font-weight: 900;">${formattedGaji}</div>
          </div>
          
          <p style="font-size: 0.85rem; color: #64748b; line-height: 1.6; margin-top: 32px;">
            Silakan masuk ke aplikasi <strong>RMP Digitals</strong> untuk melihat rincian lengkap slip gaji, rincian tunjangan, dan status pembayaran Anda.
          </p>
          
          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || "#"}" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; padding: 14px 28px; border-radius: 10px; font-weight: 850; text-decoration: none; font-size: 0.85rem;">MASUK KE DASHBOARD</a>
          </div>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 0.7rem; color: #94a3b8; margin: 0; font-weight: 600; line-height: 1.6;">
            &copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS<br/>
            Email ini dikirim secara otomatis oleh Sistem Payroll RMP Digitals.
          </p>
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

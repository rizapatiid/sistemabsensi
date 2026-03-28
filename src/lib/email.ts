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
  const dashboardLink = "https://www.rmp.my.id/"
  const logoUrl = "https://www.rmp.my.id/logositus.png"

  const mailOptions = {
    from: `"RMP Digitals Payroll" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: `[SLIP GAJI] - Periode ${monthName} ${year}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
        
        {/* HEADER SECTION - BRANDING */}
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
          
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 16px; padding: 32px; margin-bottom: 40px; text-align: center; box-shadow: 0 10px 20px -5px rgba(30, 58, 138, 0.2);">
            <div style="color: rgba(255, 255, 255, 0.8); font-size: 0.7rem; font-weight: 850; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em;">Total Gaji Diterbitkan</div>
            <div style="color: #ffffff; font-size: 2rem; font-weight: 950; letter-spacing: -0.02em;">${formattedGaji}</div>
          </div>
          
          <div style="border-left: 4px solid #3b82f6; background-color: #f0f9ff; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 40px;">
            <p style="font-size: 0.85rem; color: #1e40af; line-height: 1.6; margin: 0; font-weight: 600;">
              Laporan ini bersifat rahasia. Silakan akses portal resmi untuk melihat rincian tunjangan, potongan, dan status transfer bank Anda.
            </p>
          </div>
          
          <div style="text-align: center;">
            <a href="${dashboardLink}" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; padding: 18px 36px; border-radius: 14px; font-weight: 850; text-decoration: none; font-size: 0.9rem; letter-spacing: 0.02em; transition: background 0.3s ease;">BUKA DASHBOARD PERSONIL</a>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 0.65rem; color: #94a3b8; margin: 0; font-weight: 650; line-height: 1.8; text-transform: uppercase; letter-spacing: 0.05em;">
            &copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS<br/>
            SYNERGY & TECHNOLOGY FOR EXCELLENCE
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
          <div style="background-color: rgba(255,255,255,0.2); display: inline-block; padding: 8px 16px; border-radius: 40px; margin-bottom: 16px;">
            <span style="color: #ffffff; font-size: 0.75rem; font-weight: 850; letter-spacing: 0.1em; text-transform: uppercase;">Pembayaran Berhasil</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 1.75rem; font-weight: 950; letter-spacing: -0.02em;">DANA TELAH DIKIRIM</h1>
        </div>
        
        <div style="padding: 48px 40px;">
          <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 32px; line-height: 1.6;">
            Halo <strong>${employeeName.toUpperCase()}</strong>,<br/>
            Selamat! Gaji Anda periode <strong>${monthName} ${year}</strong> telah berhasil ditransfer oleh tim Keuangan RMP.
          </p>
          
          <div style="background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 16px; padding: 32px; margin-bottom: 40px; text-align: center;">
            <div style="color: #059669; font-size: 0.75rem; font-weight: 850; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">Jumlah yang Ditransfer</div>
            <div style="color: #064e3b; font-size: 2.25rem; font-weight: 950;">${formattedGaji}</div>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
            <h3 style="font-size: 0.8rem; font-weight: 850; color: #1e3a8a; text-transform: uppercase; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; letter-spacing: 0.05em;">Rekening Tujuan</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #94a3b8; font-size: 0.75rem; font-weight: 600; padding: 8px 0;">INSTITUSI BANK</td>
                <td style="color: #0f172a; font-size: 0.85rem; font-weight: 750; text-align: right; padding: 8px 0;">${bankName || "-"}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; font-size: 0.75rem; font-weight: 600; padding: 8px 0;">NOMOR REKENING</td>
                <td style="color: #0f172a; font-size: 0.85rem; font-weight: 750; text-align: right; padding: 8px 0;">${accNo || "-"}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; font-size: 0.75rem; font-weight: 600; padding: 8px 0;">ATAS NAMA</td>
                <td style="color: #0f172a; font-size: 0.85rem; font-weight: 750; text-align: right; padding: 8px 0;">${accName || "-"}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 0.8rem; color: #94a3b8; line-height: 1.6; margin-top: 40px; text-align: center;">
            Terima kasih atas dedikasi dan kontribusi Anda bagi PT RIZA MEDIA PRODUCTIONS. <br/> Terus semangat berkarya bagi negeri.
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 0.65rem; color: #94a3b8; margin: 0; font-weight: 650; line-height: 1.8; text-transform: uppercase; letter-spacing: 0.05em;">
            &copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS<br/>
            RMP DIGITALS FINTECH CORE
          </p>
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

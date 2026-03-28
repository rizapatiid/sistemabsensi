import nodemailer from "nodemailer"
import { generatePayrollPDF, generateInvoicePDF } from "./pdf"

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
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
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
      body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', sans-serif; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
      .header { padding: 40px 20px; text-align: center; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; }
      .content { padding: 40px 30px; }
      .footer { padding: 30px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
      .btn { display: inline-block; padding: 16px 32px; background-color: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; margin-top: 20px; transition: all 0.3s ease; text-align: center; }
      .badge { display: inline-block; padding: 6px 14px; border-radius: 30px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; }
      @media (max-width: 480px) { .container { margin: 0; border-radius: 0; } .content { padding: 30px 20px; } .btn { width: 100%; box-sizing: border-box; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logoUrl}" alt="RMP Digitals" width="70" style="margin-bottom: 15px;">
        <h2 style="margin: 0; color: #1e3a8a; font-size: 16px; font-weight: 800; letter-spacing: 0.1em;">RMP DIGITALS</h2>
      </div>
      <div class="content">${content}</div>
      <div class="footer">
        <p style="margin: 0; color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS</p>
      </div>
    </div>
  </body>
  </html>
`

/**
 * 1. NOTIFIKASI PAYROLL TERBIT (WITH PDF)
 */
export async function sendPayrollNotificationEmail(
  toEmail: string, 
  employeeName: string, 
  month: number, 
  year: number, 
  totalGaji: number,
  employeeId: string,
  jabatan: string,
  gajiPokok: number,
  tunjangan: number,
  tipeGaji: string,
  jumlahAbsen: number
) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }
  const monthName = getMonthName(month)
  const formattedGaji = formatRupiah(totalGaji)

  const pdfBuffer = await generatePayrollPDF({
    employeeName, employeeId, jabatan, month, year, gajiPokok, tunjangan, totalGaji, tipeGaji, jumlahAbsen
  })

  const content = `
    <div class="badge" style="background-color: #e0e7ff; color: #3730a3;">Slip Gaji Digital</div>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 20px;">Halo, ${employeeName.toUpperCase()}! 👋</h1>
    <p style="color: #475569; font-size: 15px;">Slip gaji Anda periode <strong>${monthName} ${year}</strong> telah diterbitkan. Silakan periksa dokumen PDF resmi yang telah kami lampirkan di email ini.</p>
    
    <div style="background-color: #1e3a8a; border-radius: 16px; padding: 25px; margin-top: 30px; text-align: center; color: #ffffff;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; opacity: 0.8;">Total Gaji Bersih</div>
      <div style="font-size: 28px; font-weight: 950;">${formattedGaji}</div>
    </div>
    
    <div style="text-align: center; margin-top: 15px;">
      <a href="https://www.rmp.my.id/" class="btn">PORTAL RMP DIGITALS</a>
    </div>
  `
  
  try {
    await transporter.sendMail({
      from: `"RMP Digitals Payroll" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `[SLIP GAJI] - ${monthName} ${year} (${employeeName})`,
      html: emailBaseTemplate("Slip Gaji Digital", "", content, "Fisik slip gaji terlampir dalam format PDF."),
      attachments: [{
        filename: `SLIP_GAJI_${employeeName.replace(/ /g, "_")}_${monthName.toUpperCase()}_${year}.pdf`,
        content: pdfBuffer
      }]
    })
    return { success: true }
  } catch (err) { return { error: "Gagal kirim email payroll" } }
}

/**
 * 2. NOTIFIKASI PEMBAYARAN BERHASIL (WITH INVOICE PDF)
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

  const pdfBuffer = await generateInvoicePDF({
    employeeName, month, year, totalGaji, bankName, accNo, accName
  })

  const content = `
    <div class="badge" style="background-color: #dcfce7; color: #166534;">Konfirmasi Pembayaran</div>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 20px;">Dana Sudah Dikirim! 💸</h1>
    <p style="color: #475569; font-size: 15px;">Gaji periode <strong>${monthName} ${year}</strong> telah berhasil ditransfer. Dokumen Tanda Terima resmi PDF telah kami lampirkan untuk arsip Anda.</p>
    
    <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 25px; margin-top: 30px; text-align: center;">
      <div style="font-size: 28px; font-weight: 900; color: #166534;">${formattedGaji}</div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"RMP Finance" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: `[DIBAYAR] - Gaji ${monthName} ${year} Sukses`,
      html: emailBaseTemplate("Tanda Terima Pembayaran", "", content, "Invoice bukti bayar terlampir."),
      attachments: [{
        filename: `INVOICE_GAJI_${employeeName.replace(/ /g, "_")}_${monthName.toUpperCase()}_${year}.pdf`,
        content: pdfBuffer
      }]
    })
    return { success: true }
  } catch (err) { return { error: "Gagal kirim email pembayaran" } }
}

/**
 * 3. NOTIFIKASI KEAMANAN LOGIN
 */
export async function sendLoginNotificationEmail(toEmail: string, employeeName: string, ip: string, userAgent: string) {
  if (!toEmail) return { error: "Email karyawan tidak tersedia" }
  const now = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date())
  const content = `
    <div class="badge" style="background-color: #fff7ed; color: #9a3412;">Aktivitas Keamanan</div>
    <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 20px;">Aktivitas Login Baru 🚨</h1>
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; font-size: 13px; color: #475569;">
      <strong>Waktu:</strong> ${now}<br/>
      <strong>IP Address:</strong> ${ip}<br/>
      <strong>Browser:</strong> ${userAgent}
    </div>
  `
  try {
    await transporter.sendMail({ from: `"RMP Security" <${process.env.EMAIL_FROM}>`, to: toEmail, subject: `❗ Alert: Aktivitas Login RMP Digitals`, html: emailBaseTemplate("Security Alert", "", content, "Security Protocol RMP.") })
    return { success: true }
  } catch (err) { return { error: "Gagal login alert" } }
}

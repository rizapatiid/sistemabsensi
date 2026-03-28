import PDFDocument from "pdfkit"
import path from "path"
import fs from "fs"

/**
 * World-Class PDF Generation for RMP Digitals
 * Optimized for Prestigous Personnel Documentation with Fail-Safe Rejection.
 */

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

export async function generatePayrollPDF(data: {
  employeeName: string,
  employeeId: string,
  jabatan: string,
  month: number,
  year: number,
  gajiPokok: number,
  tunjangan: number,
  totalGaji: number,
  tipeGaji: string,
  jumlahAbsen: number
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 })
      const buffers: any[] = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      const logoPath = path.join(process.cwd(), "public", "logositus.png")
      
      if (fs.existsSync(logoPath)) { doc.image(logoPath, 50, 45, { width: 45 }) }
      doc.fillColor("#1e3a8a").fontSize(20).font("Helvetica-Bold").text("RMP DIGITALS", 110, 50)
      doc.fontSize(10).font("Helvetica").text("PT RIZA MEDIA PRODUCTIONS", 110, 75)
      doc.moveTo(50, 115).lineTo(550, 115).strokeColor("#e2e8f0").stroke()
      
      doc.fillColor("#0f172a").fontSize(16).font("Helvetica-Bold").text("SLIP GAJI KARYAWAN", 50, 140, { align: "center" })
      doc.fontSize(10).font("Helvetica").text(`Periode: ${getMonthName(data.month)} ${data.year}`, 50, 160, { align: "center" })

      doc.rect(50, 190, 500, 70).fill("#f8fafc")
      doc.fillColor("#1e3a8a").font("Helvetica-Bold").fontSize(9).text("INFORMASI PENERIMA", 65, 205)
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(11).text(data.employeeName.toUpperCase(), 65, 222)
      doc.font("Helvetica").fontSize(9).fillColor("#64748b").text(`ID: ${data.employeeId} | Jabatan: ${data.jabatan || "-"}`, 65, 240)

      const startY = 280
      doc.fillColor("#1e3a8a").font("Helvetica-Bold").fontSize(10).text("RINCIAN PENGHASILAN", 50, startY)
      doc.moveTo(50, startY + 15).lineTo(550, startY + 15).stroke()

      const drawRow = (label: string, value: string, y: number, isTotal = false) => {
        if (isTotal) {
          doc.rect(50, y - 5, 500, 25).fill("#1e3a8a")
          doc.fillColor("#ffffff").font("Helvetica-Bold").text(label, 65, y)
          doc.text(value, 400, y, { width: 135, align: "right" })
        } else {
          doc.fillColor("#475569").font("Helvetica").text(label, 65, y)
          doc.fillColor("#0f172a").font("Helvetica-Bold").text(value, 400, y, { width: 135, align: "right" })
        }
      }

      drawRow(`Gaji Pokok (${data.tipeGaji})`, formatRupiah(data.gajiPokok), startY + 35)
      if (data.tipeGaji === "HARIAN") { drawRow("Kehadiran Tercatat", `${data.jumlahAbsen} Hari Kerja`, startY + 55) }
      drawRow("Tunjangan & Bonus", formatRupiah(data.tunjangan), startY + 75)
      drawRow("TOTAL GAJI BERSIH", formatRupiah(data.totalGaji), startY + 110, true)

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

export async function generateInvoicePDF(data: {
  employeeName: string, month: number, year: number, totalGaji: number, bankName: string, accNo: string, accName: string
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 })
      const buffers: any[] = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      const logoPath = path.join(process.cwd(), "public", "logositus.png")
      doc.rect(0, 0, 600, 115).fill("#1e293b")
      if (fs.existsSync(logoPath)) { doc.image(logoPath, 50, 35, { width: 45 }) }
      doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold").text("TANDA TERIMA PEMBAYARAN", 110, 45)

      doc.fillColor("#0f172a").fontSize(11).font("Helvetica").text("Telah berhasil ditransfer sejumlah dana kepada:", 50, 150)
      doc.fontSize(14).font("Helvetica-Bold").text(data.employeeName.toUpperCase(), 50, 175)

      doc.rect(50, 210, 500, 100).fill("#f8fafc")
      doc.fillColor("#1e3a8a").fontSize(10).font("Helvetica-Bold").text("RINCIAN TRANSFER", 70, 230)
      doc.fillColor("#64748b").font("Helvetica").fontSize(9).text("BANK TUJUAN", 70, 255)
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(10).text(data.bankName || "-", 200, 255)
      doc.fillColor("#64748b").font("Helvetica").fontSize(9).text("NOMOR REKENING", 70, 275)
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(10).text(data.accNo || "-", 200, 275)

      doc.rect(50, 340, 500, 60).fill("#059669")
      doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold").text("JUMLAH PEMBAYARAN LUNAS", 70, 355)
      doc.fontSize(18).text(formatRupiah(data.totalGaji), 70, 372)

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import AbsensiClient from "./client"
import { getTodayJakarta } from "@/lib/date"

export default async function EmployeeAbsensiPage() {
  const session = await getSession()
  const today = getTodayJakarta()

  // Cek apakah hari ini weekend (Sabtu/Minggu)
  const isWeekend = today.getDay() === 0 || today.getDay() === 6
  
  // Cek apakah hari ini diset libur oleh admin
  const isHoliday = await prisma.calendar.findFirst({
    where: { tanggal: today, isHoliday: true }
  })

  // Cek apakah sudah absen
  const existing = await prisma.attendance.findUnique({
    where: {
      idKaryawan_tanggal: {
        idKaryawan: session?.id || "",
        tanggal: today
      }
    }
  })

  // Gunakan queryRaw karena prisma generate gagal akibat file lock di Windows (EPERM)
  // Ini menghindari runtime validation error pada client yang belum terupdate
  const userResults = await prisma.$queryRaw<any[]>`
    SELECT "absensiEnabled" FROM "User" WHERE id = ${session?.id || ""}
  `
  const user = userResults[0]

  let isClosed = false
  let message = ""

  if (!user?.absensiEnabled) {
    isClosed = true
    message = "Akses otorisasi presensi Anda sedang ditangguhkan. Silakan hubungi Administrator HRD untuk informasi lebih lanjut."
  } else if (isWeekend) {
    isClosed = true
    message = "Sistem presensi tidak beroperasi pada akhir pekan. Selamat menikmati waktu istirahat Anda."
  } else if (isHoliday) {
    isClosed = true
    message = `Layanan presensi dihentikan sementara sehubungan dengan libur operasional: ${isHoliday.keterangan}.`
  }

  return <AbsensiClient 
    isClosed={isClosed} 
    message={message} 
    hasAttendance={!!existing} 
    existingStatus={existing?.status}
    holidayImage={isHoliday?.image || null}
  />
}

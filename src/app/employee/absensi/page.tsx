import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import AbsensiClient from "./client"

export default async function EmployeeAbsensiPage() {
  const session = await getSession()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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

  let isClosed = false
  let message = ""

  if (isWeekend) {
    isClosed = true
    message = "Portal absensi ditutup pada akhir pekan (Sabtu & Minggu)."
  } else if (isHoliday) {
    isClosed = true
    message = `Portal absensi ditutup. Hari libur: ${isHoliday.keterangan}`
  }

  return <AbsensiClient isClosed={isClosed} message={message} hasAttendance={!!existing} />
}

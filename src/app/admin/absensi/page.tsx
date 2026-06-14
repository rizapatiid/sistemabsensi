import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import AbsensiAdminClient from "./AbsensiAdminClient"

export default async function AdminAbsensiPage() {
  const employees = await prisma.user.findMany({
    where: { role: "KARYAWAN" },
    select: { id: true, nama: true },
    orderBy: { nama: "asc" }
  })

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const startOfMonth = new Date(currentYear, currentMonth, 1)
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

  const absensi = await prisma.attendance.findMany({
    where: {
      tanggal: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    },
    include: {
      user: true
    },
    orderBy: {
      tanggal: "desc"
    }
  })

  const countHadir = absensi.filter(a => a.status === 'HADIR').length
  const countIzin = absensi.filter(a => a.status === 'IZIN').length

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  const currentMonthName = monthNames[currentMonth]

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '12px' }}>
      <AbsensiAdminClient absensi={absensi} initialEmployees={employees} />
    </div>
  )
}

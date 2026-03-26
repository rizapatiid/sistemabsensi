import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import AbsensiAdminClient from "./AbsensiAdminClient"

export default async function AdminAbsensiPage() {
  const absensi = await prisma.attendance.findMany({
    include: {
      user: true
    },
    orderBy: {
      tanggal: "desc"
    }
  })

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Detail Absensi Karyawan</h1>
      
      <div className={`${styles.section} glass`}>
        <h2>Riwayat Kehadiran Global</h2>
        <AbsensiAdminClient absensi={absensi} />
      </div>
    </div>
  )
}
